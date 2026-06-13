// Generated from Supabase migrations. Run `npm run db:types` to refresh.
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
      "admin_audit_logs": {
        Row: {
          "id": number
          "actor_id": string | null
          "table_name": string
          "record_id": string | null
          "action": string
          "old_data": Json | null
          "new_data": Json | null
          "created_at": string
        }
        Insert: {
          "id"?: number
          "actor_id"?: string | null
          "table_name": string
          "record_id"?: string | null
          "action": string
          "old_data"?: Json | null
          "new_data"?: Json | null
          "created_at"?: string
        }
        Update: {
          "id"?: number
          "actor_id"?: string | null
          "table_name"?: string
          "record_id"?: string | null
          "action"?: string
          "old_data"?: Json | null
          "new_data"?: Json | null
          "created_at"?: string
        }
        Relationships: [

        ]
      }
      "box_items": {
        Row: {
          "box_id": string
          "product_id": string
          "quantity": number
          "position": number
          "created_at": string
        }
        Insert: {
          "box_id": string
          "product_id": string
          "quantity"?: number
          "position"?: number
          "created_at"?: string
        }
        Update: {
          "box_id"?: string
          "product_id"?: string
          "quantity"?: number
          "position"?: number
          "created_at"?: string
        }
        Relationships: [
          {
            foreignKeyName: "box_items_box_id_fkey"
            columns: ["box_id"]
            isOneToOne: false
            referencedRelation: "boxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "box_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      "boxes": {
        Row: {
          "id": string
          "slug": string
          "name": string
          "description": string
          "occasion": string
          "status": Database["public"]["Enums"]["product_status"]
          "individual_total_price_tnd": number
          "box_price_tnd": number
          "placeholder_image_label": string | null
          "position": number
          "published_at": string | null
          "created_by": string | null
          "updated_by": string | null
          "created_at": string
          "updated_at": string
        }
        Insert: {
          "id"?: string
          "slug": string
          "name": string
          "description": string
          "occasion": string
          "status"?: Database["public"]["Enums"]["product_status"]
          "individual_total_price_tnd": number
          "box_price_tnd": number
          "placeholder_image_label"?: string | null
          "position"?: number
          "published_at"?: string | null
          "created_by"?: string | null
          "updated_by"?: string | null
          "created_at"?: string
          "updated_at"?: string
        }
        Update: {
          "id"?: string
          "slug"?: string
          "name"?: string
          "description"?: string
          "occasion"?: string
          "status"?: Database["public"]["Enums"]["product_status"]
          "individual_total_price_tnd"?: number
          "box_price_tnd"?: number
          "placeholder_image_label"?: string | null
          "position"?: number
          "published_at"?: string | null
          "created_by"?: string | null
          "updated_by"?: string | null
          "created_at"?: string
          "updated_at"?: string
        }
        Relationships: [

        ]
      }
      "categories": {
        Row: {
          "id": string
          "slug": string
          "name": string
          "description": string | null
          "placeholder_image_label": string | null
          "position": number
          "is_active": boolean
          "created_at": string
          "updated_at": string
        }
        Insert: {
          "id"?: string
          "slug": string
          "name": string
          "description"?: string | null
          "placeholder_image_label"?: string | null
          "position"?: number
          "is_active"?: boolean
          "created_at"?: string
          "updated_at"?: string
        }
        Update: {
          "id"?: string
          "slug"?: string
          "name"?: string
          "description"?: string | null
          "placeholder_image_label"?: string | null
          "position"?: number
          "is_active"?: boolean
          "created_at"?: string
          "updated_at"?: string
        }
        Relationships: [

        ]
      }
      "collections": {
        Row: {
          "id": string
          "slug": string
          "name": string
          "description": string | null
          "position": number
          "is_active": boolean
          "created_at": string
          "updated_at": string
        }
        Insert: {
          "id"?: string
          "slug": string
          "name": string
          "description"?: string | null
          "position"?: number
          "is_active"?: boolean
          "created_at"?: string
          "updated_at"?: string
        }
        Update: {
          "id"?: string
          "slug"?: string
          "name"?: string
          "description"?: string | null
          "position"?: number
          "is_active"?: boolean
          "created_at"?: string
          "updated_at"?: string
        }
        Relationships: [

        ]
      }
      "homepage_section_items": {
        Row: {
          "id": string
          "section_id": string
          "product_id": string | null
          "box_id": string | null
          "media_asset_id": string | null
          "placeholder_label": string | null
          "title_override": string | null
          "body_override": string | null
          "cta_label": string | null
          "cta_href": string | null
          "position": number
          "is_visible": boolean
          "settings": Json
          "created_at": string
          "updated_at": string
        }
        Insert: {
          "id"?: string
          "section_id": string
          "product_id"?: string | null
          "box_id"?: string | null
          "media_asset_id"?: string | null
          "placeholder_label"?: string | null
          "title_override"?: string | null
          "body_override"?: string | null
          "cta_label"?: string | null
          "cta_href"?: string | null
          "position"?: number
          "is_visible"?: boolean
          "settings"?: Json
          "created_at"?: string
          "updated_at"?: string
        }
        Update: {
          "id"?: string
          "section_id"?: string
          "product_id"?: string | null
          "box_id"?: string | null
          "media_asset_id"?: string | null
          "placeholder_label"?: string | null
          "title_override"?: string | null
          "body_override"?: string | null
          "cta_label"?: string | null
          "cta_href"?: string | null
          "position"?: number
          "is_visible"?: boolean
          "settings"?: Json
          "created_at"?: string
          "updated_at"?: string
        }
        Relationships: [
          {
            foreignKeyName: "homepage_section_items_box_id_fkey"
            columns: ["box_id"]
            isOneToOne: false
            referencedRelation: "boxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homepage_section_items_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homepage_section_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homepage_section_items_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "homepage_sections"
            referencedColumns: ["id"]
          }
        ]
      }
      "homepage_sections": {
        Row: {
          "id": string
          "section_key": string
          "section_type": Database["public"]["Enums"]["homepage_section_type"]
          "eyebrow": string | null
          "heading": string | null
          "body": string | null
          "theme": Database["public"]["Enums"]["content_theme"]
          "position": number
          "is_visible": boolean
          "settings": Json
          "updated_by": string | null
          "created_at": string
          "updated_at": string
        }
        Insert: {
          "id"?: string
          "section_key": string
          "section_type": Database["public"]["Enums"]["homepage_section_type"]
          "eyebrow"?: string | null
          "heading"?: string | null
          "body"?: string | null
          "theme"?: Database["public"]["Enums"]["content_theme"]
          "position": number
          "is_visible"?: boolean
          "settings"?: Json
          "updated_by"?: string | null
          "created_at"?: string
          "updated_at"?: string
        }
        Update: {
          "id"?: string
          "section_key"?: string
          "section_type"?: Database["public"]["Enums"]["homepage_section_type"]
          "eyebrow"?: string | null
          "heading"?: string | null
          "body"?: string | null
          "theme"?: Database["public"]["Enums"]["content_theme"]
          "position"?: number
          "is_visible"?: boolean
          "settings"?: Json
          "updated_by"?: string | null
          "created_at"?: string
          "updated_at"?: string
        }
        Relationships: [

        ]
      }
      "inventory_adjustments": {
        Row: {
          "id": string
          "inventory_level_id": string
          "delta": number
          "reason": Database["public"]["Enums"]["inventory_adjustment_reason"]
          "note": string | null
          "reference_type": string | null
          "reference_id": string | null
          "created_by": string | null
          "created_at": string
        }
        Insert: {
          "id"?: string
          "inventory_level_id": string
          "delta": number
          "reason": Database["public"]["Enums"]["inventory_adjustment_reason"]
          "note"?: string | null
          "reference_type"?: string | null
          "reference_id"?: string | null
          "created_by"?: string | null
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "inventory_level_id"?: string
          "delta"?: number
          "reason"?: Database["public"]["Enums"]["inventory_adjustment_reason"]
          "note"?: string | null
          "reference_type"?: string | null
          "reference_id"?: string | null
          "created_by"?: string | null
          "created_at"?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_adjustments_inventory_level_id_fkey"
            columns: ["inventory_level_id"]
            isOneToOne: false
            referencedRelation: "inventory_levels"
            referencedColumns: ["id"]
          }
        ]
      }
      "inventory_levels": {
        Row: {
          "id": string
          "variant_id": string
          "location_id": string
          "stocked_quantity": number
          "reserved_quantity": number
          "low_stock_threshold": number
          "created_at": string
          "updated_at": string
        }
        Insert: {
          "id"?: string
          "variant_id": string
          "location_id": string
          "stocked_quantity"?: number
          "reserved_quantity"?: number
          "low_stock_threshold"?: number
          "created_at"?: string
          "updated_at"?: string
        }
        Update: {
          "id"?: string
          "variant_id"?: string
          "location_id"?: string
          "stocked_quantity"?: number
          "reserved_quantity"?: number
          "low_stock_threshold"?: number
          "created_at"?: string
          "updated_at"?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_levels_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "inventory_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_levels_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          }
        ]
      }
      "inventory_locations": {
        Row: {
          "id": string
          "code": string
          "name": string
          "is_active": boolean
          "created_at": string
          "updated_at": string
        }
        Insert: {
          "id"?: string
          "code": string
          "name": string
          "is_active"?: boolean
          "created_at"?: string
          "updated_at"?: string
        }
        Update: {
          "id"?: string
          "code"?: string
          "name"?: string
          "is_active"?: boolean
          "created_at"?: string
          "updated_at"?: string
        }
        Relationships: [

        ]
      }
      "media_assets": {
        Row: {
          "id": string
          "bucket": string
          "object_path": string
          "alt_text": string
          "width": number | null
          "height": number | null
          "mime_type": string | null
          "file_size_bytes": number | null
          "created_by": string | null
          "created_at": string
          "updated_at": string
        }
        Insert: {
          "id"?: string
          "bucket"?: string
          "object_path": string
          "alt_text": string
          "width"?: number | null
          "height"?: number | null
          "mime_type"?: string | null
          "file_size_bytes"?: number | null
          "created_by"?: string | null
          "created_at"?: string
          "updated_at"?: string
        }
        Update: {
          "id"?: string
          "bucket"?: string
          "object_path"?: string
          "alt_text"?: string
          "width"?: number | null
          "height"?: number | null
          "mime_type"?: string | null
          "file_size_bytes"?: number | null
          "created_by"?: string | null
          "created_at"?: string
          "updated_at"?: string
        }
        Relationships: [

        ]
      }
      "option_types": {
        Row: {
          "id": string
          "code": string
          "name": string
          "position": number
          "created_at": string
        }
        Insert: {
          "id"?: string
          "code": string
          "name": string
          "position"?: number
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "code"?: string
          "name"?: string
          "position"?: number
          "created_at"?: string
        }
        Relationships: [

        ]
      }
      "option_values": {
        Row: {
          "id": string
          "option_type_id": string
          "code": string
          "label": string
          "swatch_hex": string | null
          "metadata": Json
          "position": number
          "created_at": string
        }
        Insert: {
          "id"?: string
          "option_type_id": string
          "code": string
          "label": string
          "swatch_hex"?: string | null
          "metadata"?: Json
          "position"?: number
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "option_type_id"?: string
          "code"?: string
          "label"?: string
          "swatch_hex"?: string | null
          "metadata"?: Json
          "position"?: number
          "created_at"?: string
        }
        Relationships: [
          {
            foreignKeyName: "option_values_option_type_id_fkey"
            columns: ["option_type_id"]
            isOneToOne: false
            referencedRelation: "option_types"
            referencedColumns: ["id"]
          }
        ]
      }
      "product_collections": {
        Row: {
          "product_id": string
          "collection_id": string
          "position": number
          "created_at": string
        }
        Insert: {
          "product_id": string
          "collection_id": string
          "position"?: number
          "created_at"?: string
        }
        Update: {
          "product_id"?: string
          "collection_id"?: string
          "position"?: number
          "created_at"?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_collections_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_collections_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      "product_media": {
        Row: {
          "id": string
          "product_id": string
          "variant_id": string | null
          "option_value_id": string | null
          "media_asset_id": string | null
          "placeholder_label": string | null
          "role": string
          "position": number
          "is_primary": boolean
          "created_at": string
        }
        Insert: {
          "id"?: string
          "product_id": string
          "variant_id"?: string | null
          "option_value_id"?: string | null
          "media_asset_id"?: string | null
          "placeholder_label"?: string | null
          "role"?: string
          "position"?: number
          "is_primary"?: boolean
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "product_id"?: string
          "variant_id"?: string | null
          "option_value_id"?: string | null
          "media_asset_id"?: string | null
          "placeholder_label"?: string | null
          "role"?: string
          "position"?: number
          "is_primary"?: boolean
          "created_at"?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_media_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_media_option_value_id_fkey"
            columns: ["option_value_id"]
            isOneToOne: false
            referencedRelation: "option_values"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_media_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_media_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          }
        ]
      }
      "product_option_values": {
        Row: {
          "product_id": string
          "option_value_id": string
          "position": number
          "created_at": string
        }
        Insert: {
          "product_id": string
          "option_value_id": string
          "position"?: number
          "created_at"?: string
        }
        Update: {
          "product_id"?: string
          "option_value_id"?: string
          "position"?: number
          "created_at"?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_option_values_option_value_id_fkey"
            columns: ["option_value_id"]
            isOneToOne: false
            referencedRelation: "option_values"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_option_values_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      "product_variants": {
        Row: {
          "id": string
          "product_id": string
          "sku": string
          "barcode": string | null
          "title": string
          "price_tnd": number | null
          "compare_at_price_tnd": number | null
          "manage_inventory": boolean
          "is_active": boolean
          "position": number
          "created_at": string
          "updated_at": string
        }
        Insert: {
          "id"?: string
          "product_id": string
          "sku": string
          "barcode"?: string | null
          "title": string
          "price_tnd"?: number | null
          "compare_at_price_tnd"?: number | null
          "manage_inventory"?: boolean
          "is_active"?: boolean
          "position"?: number
          "created_at"?: string
          "updated_at"?: string
        }
        Update: {
          "id"?: string
          "product_id"?: string
          "sku"?: string
          "barcode"?: string | null
          "title"?: string
          "price_tnd"?: number | null
          "compare_at_price_tnd"?: number | null
          "manage_inventory"?: boolean
          "is_active"?: boolean
          "position"?: number
          "created_at"?: string
          "updated_at"?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      "products": {
        Row: {
          "id": string
          "slug": string
          "name": string
          "short_description": string | null
          "description": string
          "category_id": string | null
          "status": Database["public"]["Enums"]["product_status"]
          "base_price_tnd": number
          "currency_code": string
          "badges": string[]
          "is_new": boolean
          "is_best_seller": boolean
          "image_ratio": Database["public"]["Enums"]["image_ratio"]
          "details": string | null
          "composition": string | null
          "fit": string | null
          "care": string | null
          "delivery_note": string | null
          "returns_note": string | null
          "seo_title": string | null
          "seo_description": string | null
          "published_at": string | null
          "created_by": string | null
          "updated_by": string | null
          "created_at": string
          "updated_at": string
        }
        Insert: {
          "id"?: string
          "slug": string
          "name": string
          "short_description"?: string | null
          "description": string
          "category_id"?: string | null
          "status"?: Database["public"]["Enums"]["product_status"]
          "base_price_tnd": number
          "currency_code"?: string
          "badges"?: string[]
          "is_new"?: boolean
          "is_best_seller"?: boolean
          "image_ratio"?: Database["public"]["Enums"]["image_ratio"]
          "details"?: string | null
          "composition"?: string | null
          "fit"?: string | null
          "care"?: string | null
          "delivery_note"?: string | null
          "returns_note"?: string | null
          "seo_title"?: string | null
          "seo_description"?: string | null
          "published_at"?: string | null
          "created_by"?: string | null
          "updated_by"?: string | null
          "created_at"?: string
          "updated_at"?: string
        }
        Update: {
          "id"?: string
          "slug"?: string
          "name"?: string
          "short_description"?: string | null
          "description"?: string
          "category_id"?: string | null
          "status"?: Database["public"]["Enums"]["product_status"]
          "base_price_tnd"?: number
          "currency_code"?: string
          "badges"?: string[]
          "is_new"?: boolean
          "is_best_seller"?: boolean
          "image_ratio"?: Database["public"]["Enums"]["image_ratio"]
          "details"?: string | null
          "composition"?: string | null
          "fit"?: string | null
          "care"?: string | null
          "delivery_note"?: string | null
          "returns_note"?: string | null
          "seo_title"?: string | null
          "seo_description"?: string | null
          "published_at"?: string | null
          "created_by"?: string | null
          "updated_by"?: string | null
          "created_at"?: string
          "updated_at"?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      "profiles": {
        Row: {
          "id": string
          "first_name": string | null
          "last_name": string | null
          "phone": string | null
          "avatar_path": string | null
          "marketing_consent": boolean
          "marketing_consent_at": string | null
          "created_at": string
          "updated_at": string
        }
        Insert: {
          "id": string
          "first_name"?: string | null
          "last_name"?: string | null
          "phone"?: string | null
          "avatar_path"?: string | null
          "marketing_consent"?: boolean
          "marketing_consent_at"?: string | null
          "created_at"?: string
          "updated_at"?: string
        }
        Update: {
          "id"?: string
          "first_name"?: string | null
          "last_name"?: string | null
          "phone"?: string | null
          "avatar_path"?: string | null
          "marketing_consent"?: boolean
          "marketing_consent_at"?: string | null
          "created_at"?: string
          "updated_at"?: string
        }
        Relationships: [

        ]
      }
      "user_roles": {
        Row: {
          "user_id": string
          "role": Database["public"]["Enums"]["app_role"]
          "created_by": string | null
          "created_at": string
        }
        Insert: {
          "user_id": string
          "role": Database["public"]["Enums"]["app_role"]
          "created_by"?: string | null
          "created_at"?: string
        }
        Update: {
          "user_id"?: string
          "role"?: Database["public"]["Enums"]["app_role"]
          "created_by"?: string | null
          "created_at"?: string
        }
        Relationships: [

        ]
      }
      "variant_option_values": {
        Row: {
          "variant_id": string
          "option_value_id": string
          "created_at": string
        }
        Insert: {
          "variant_id": string
          "option_value_id": string
          "created_at"?: string
        }
        Update: {
          "variant_id"?: string
          "option_value_id"?: string
          "created_at"?: string
        }
        Relationships: [
          {
            foreignKeyName: "variant_option_values_option_value_id_fkey"
            columns: ["option_value_id"]
            isOneToOne: false
            referencedRelation: "option_values"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variant_option_values_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: Record<PropertyKey, never>
    Functions: {
      "admin_adjust_inventory": {
        Args: {
          "requested_inventory_level_id": string
          "requested_stocked_quantity": number
          "requested_low_stock_threshold": number
          "requested_note": string
        }
        Returns: undefined
      }
      "admin_delete_media_asset": {
        Args: {
          "requested_media_asset_id": string
        }
        Returns: Json
      }
      "admin_move_homepage_item": {
        Args: {
          "requested_item_id": string
          "requested_direction": number
        }
        Returns: undefined
      }
      "admin_move_homepage_section": {
        Args: {
          "requested_section_id": string
          "requested_direction": number
        }
        Returns: undefined
      }
      "admin_save_box": {
        Args: {
          "payload": Json
        }
        Returns: string
      }
      "admin_save_product": {
        Args: {
          "payload": Json
        }
        Returns: string
      }
      "can_manage_content": {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      "has_role": {
        Args: {
          "requested_role": Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      "is_admin": {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      "is_published_box": {
        Args: {
          "requested_box_id": string
        }
        Returns: boolean
      }
      "is_published_product": {
        Args: {
          "requested_product_id": string
        }
        Returns: boolean
      }
    }
    Enums: {
      "app_role": "customer" | "editor" | "admin"
      "content_theme": "light" | "dark" | "off_white"
      "homepage_section_type": "hero" | "product_grid" | "category_grid" | "editorial" | "slider" | "boxes" | "services" | "newsletter"
      "image_ratio": "portrait" | "square" | "landscape"
      "inventory_adjustment_reason": "initial" | "restock" | "sale" | "return" | "damage" | "correction" | "reservation" | "release"
      "product_status": "draft" | "active" | "archived"
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
