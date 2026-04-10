export function isAdminRole(role?: string | null) {
  return String(role || "").trim().toLowerCase() === "admin";
}
