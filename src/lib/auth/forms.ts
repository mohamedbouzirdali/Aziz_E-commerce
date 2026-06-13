export type AuthFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<
    Record<"firstName" | "lastName" | "email" | "password", string>
  >;
};

export const initialAuthFormState: AuthFormState = {
  status: "idle",
};
