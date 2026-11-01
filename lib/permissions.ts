export const ROLES = {
  FARMER: "farmer",
  ADMIN: "admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export type Permission =
  | "points:read"
  | "points:write"
  | "sensors:read"
  | "alerts:write"
  | "reports:read"
  | "demo:simulate";

const FARMER_PERMISSIONS: Permission[] = [
  "points:read",
  "points:write",
  "sensors:read",
  "alerts:write",
  "reports:read",
  "demo:simulate",
];

const ADMIN_PERMISSIONS: Permission[] = [...FARMER_PERMISSIONS, "points:write"];

export function hasPermission(role: Role, permission: Permission): boolean {
  const granted = role === ROLES.ADMIN ? ADMIN_PERMISSIONS : FARMER_PERMISSIONS;
  return granted.includes(permission);
}

export function isAdmin(role: Role): boolean {
  return role === ROLES.ADMIN;
}
