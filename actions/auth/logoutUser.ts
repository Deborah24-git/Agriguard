"use server";

import { signOut } from "@/auth";

export async function logoutUser(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
