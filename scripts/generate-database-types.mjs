import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const databaseUrl = process.env.DATABASE_URL;
const outputPath = resolve(
  process.cwd(),
  process.argv[2] ?? "src/lib/supabase/database.types.ts",
);

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

function query(sql) {
  const output = execFileSync(
    process.env.PSQL_BIN ?? "psql",
    [databaseUrl, "-X", "-A", "-t", "-v", "ON_ERROR_STOP=1", "-c", sql],
    { encoding: "utf8" },
  ).trim();

  return output ? JSON.parse(output) : [];
}

const enums = query(`
  select coalesce(json_agg(enum_definition order by enum_definition->>'name'), '[]'::json)
  from (
    select json_build_object(
      'name', types.typname,
      'values', json_agg(enum_values.enumlabel order by enum_values.enumsortorder)
    ) as enum_definition
    from pg_type types
    join pg_enum enum_values on enum_values.enumtypid = types.oid
    join pg_namespace namespaces on namespaces.oid = types.typnamespace
    where namespaces.nspname = 'public'
    group by types.typname
  ) definitions;
`);

const columns = query(`
  select coalesce(json_agg(column_definition order by table_name, ordinal_position), '[]'::json)
  from (
    select
      columns.table_name,
      columns.column_name,
      columns.data_type,
      columns.udt_schema,
      columns.udt_name,
      columns.is_nullable = 'YES' as is_nullable,
      columns.column_default is not null as has_default,
      columns.is_identity = 'YES' as is_identity,
      columns.ordinal_position
    from information_schema.columns
    where columns.table_schema = 'public'
  ) column_definition;
`);

const relationships = query(`
  select coalesce(json_agg(relationship_definition order by table_name, constraint_name), '[]'::json)
  from (
    select
      constraints.table_name,
      constraints.constraint_name,
      json_agg(local_columns.column_name order by local_columns.ordinal_position) as columns,
      referenced_constraints.table_name as referenced_relation,
      json_agg(referenced_columns.column_name order by local_columns.ordinal_position) as referenced_columns
    from information_schema.table_constraints constraints
    join information_schema.key_column_usage local_columns
      on local_columns.constraint_schema = constraints.constraint_schema
      and local_columns.constraint_name = constraints.constraint_name
    join information_schema.referential_constraints foreign_keys
      on foreign_keys.constraint_schema = constraints.constraint_schema
      and foreign_keys.constraint_name = constraints.constraint_name
    join information_schema.table_constraints referenced_constraints
      on referenced_constraints.constraint_schema = foreign_keys.unique_constraint_schema
      and referenced_constraints.constraint_name = foreign_keys.unique_constraint_name
    join information_schema.key_column_usage referenced_columns
      on referenced_columns.constraint_schema = referenced_constraints.constraint_schema
      and referenced_columns.constraint_name = referenced_constraints.constraint_name
      and referenced_columns.ordinal_position = local_columns.position_in_unique_constraint
    where constraints.table_schema = 'public'
      and constraints.constraint_type = 'FOREIGN KEY'
      and referenced_constraints.table_schema = 'public'
    group by
      constraints.table_name,
      constraints.constraint_name,
      referenced_constraints.table_name
  ) relationship_definition;
`);

const functions = query(`
  select coalesce(json_agg(function_definition order by name), '[]'::json)
  from (
    select
      procedures.proname as name,
      pg_get_function_arguments(procedures.oid) as arguments,
      pg_get_function_result(procedures.oid) as result
    from pg_proc procedures
    join pg_namespace namespaces on namespaces.oid = procedures.pronamespace
    where namespaces.nspname = 'public'
      and procedures.prokind = 'f'
      and pg_get_function_result(procedures.oid) <> 'trigger'
  ) function_definition;
`);

const tableNames = [...new Set(columns.map((column) => column.table_name))];
const enumNames = new Set(enums.map((enumDefinition) => enumDefinition.name));

function mapType({ data_type: dataType, udt_schema: udtSchema, udt_name: udtName }) {
  if (dataType === "ARRAY") {
    const itemType = udtName.startsWith("_") ? udtName.slice(1) : "text";
    if (udtSchema === "public" && enumNames.has(itemType)) {
      return `Database["public"]["Enums"]["${itemType}"][]`;
    }
    return `${mapScalarType(itemType, udtSchema)}[]`;
  }

  if (udtSchema === "public" && enumNames.has(udtName)) {
    return `Database["public"]["Enums"]["${udtName}"]`;
  }

  return mapScalarType(udtName, udtSchema);
}

function mapScalarType(typeName, schemaName) {
  if (schemaName === "public" && enumNames.has(typeName)) {
    return `Database["public"]["Enums"]["${typeName}"]`;
  }

  switch (typeName) {
    case "bool":
    case "boolean":
      return "boolean";
    case "int2":
    case "int4":
    case "int8":
    case "float4":
    case "float8":
    case "numeric":
    case "smallint":
    case "integer":
    case "bigint":
    case "real":
    case "double precision":
      return "number";
    case "json":
    case "jsonb":
      return "Json";
    case "bytea":
      return "string";
    default:
      return "string";
  }
}

function property(name, type, optional = false) {
  return `          ${JSON.stringify(name)}${optional ? "?" : ""}: ${type}`;
}

function tableDefinition(tableName) {
  const tableColumns = columns.filter((column) => column.table_name === tableName);
  const tableRelationships = relationships.filter(
    (relationship) => relationship.table_name === tableName,
  );

  const row = tableColumns.map((column) => {
    const type = `${mapType(column)}${column.is_nullable ? " | null" : ""}`;
    return property(column.column_name, type);
  });

  const insert = tableColumns.map((column) => {
    const optional =
      column.is_nullable || column.has_default || column.is_identity;
    const type = `${mapType(column)}${column.is_nullable ? " | null" : ""}`;
    return property(column.column_name, type, optional);
  });

  const update = tableColumns.map((column) => {
    const type = `${mapType(column)}${column.is_nullable ? " | null" : ""}`;
    return property(column.column_name, type, true);
  });

  const relationLines = tableRelationships.map((relationship) => [
    "          {",
    `            foreignKeyName: ${JSON.stringify(relationship.constraint_name)}`,
    `            columns: ${JSON.stringify(relationship.columns)}`,
    "            isOneToOne: false",
    `            referencedRelation: ${JSON.stringify(relationship.referenced_relation)}`,
    `            referencedColumns: ${JSON.stringify(relationship.referenced_columns)}`,
    "          }",
  ].join("\n"));

  return [
    `      ${JSON.stringify(tableName)}: {`,
    "        Row: {",
    ...row,
    "        }",
    "        Insert: {",
    ...insert,
    "        }",
    "        Update: {",
    ...update,
    "        }",
    "        Relationships: [",
    relationLines.join(",\n"),
    "        ]",
    "      }",
  ].join("\n");
}

function mapFunctionType(typeName) {
  const normalized = typeName.replace(/^public\./, "").trim();
  return mapScalarType(normalized, enumNames.has(normalized) ? "public" : "pg_catalog");
}

function functionDefinition(definition) {
  const args = definition.arguments
    ? definition.arguments.split(",").map((argument) => {
        const [name, ...typeParts] = argument.trim().split(/\s+/);
        return property(name, mapFunctionType(typeParts.join(" ")));
      })
    : [];

  return [
    `      ${JSON.stringify(definition.name)}: {`,
    args.length ? "        Args: {" : "        Args: Record<PropertyKey, never>",
    ...args,
    ...(args.length ? ["        }"] : []),
    `        Returns: ${mapFunctionType(definition.result)}`,
    "      }",
  ].join("\n");
}

const output = `// Generated from Supabase migrations. Run \`npm run db:types\` to refresh.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
${tableNames.map(tableDefinition).join("\n")}
    }
    Views: Record<PropertyKey, never>
    Functions: {
${functions.map(functionDefinition).join("\n")}
    }
    Enums: {
${enums
  .map(
    (enumDefinition) =>
      `      ${JSON.stringify(enumDefinition.name)}: ${enumDefinition.values
        .map((value) => JSON.stringify(value))
        .join(" | ")}`,
  )
  .join("\n")}
    }
    CompositeTypes: Record<PropertyKey, never>
  }
}

type PublicSchema = Database["public"]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
`;

writeFileSync(outputPath, output);
console.log(`Generated ${outputPath}`);
