import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { Role } from "@/lib/permissions";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  return {
    id: session.user.id,
    name: session.user.name ?? "Farmer",
    email: session.user.email ?? "",
    role: session.user.role as Role,
  };
}

export async function requireSessionUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}
