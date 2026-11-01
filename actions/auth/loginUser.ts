"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import type { AuthFormState } from "@/types/auth";

/** Email + password sign-in. On success NextAuth redirects to the dashboard. */
export async function loginUser(
  _previous: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const requested = String(formData.get("next") ?? "/dashboard");
  const next = requested.startsWith("/") ? requested : "/dashboard";

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: next });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email or password is incorrect." };
    }
    throw error;
  }

  return { error: "" };
}
