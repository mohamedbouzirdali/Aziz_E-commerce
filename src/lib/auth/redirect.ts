export function safeRedirectPath(value: FormDataEntryValue | string | null) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/account";
  }

  try {
    const url = new URL(value, "https://elan.local");
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/account";
  }
}
