"use server";

import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import { signIn } from "@/auth";
import User from "@/models/User";
import type { AuthFormState } from "@/types/auth";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Creates a farmer account, then signs it straight in. */
export async function registerUser(
  _previous: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const farmName = String(formData.get("farm_name") ?? "").trim() || "My farm";
  const phone = String(formData.get("phone") ?? "").trim();

  if (name.length < 2) return { error: "Enter your full name." };
  if (!EMAIL.test(email)) return { error: "Enter a valid email address." };
  if (password.length < 8) return { error: "Use a password of at least 8 characters." };

  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) return { error: "An account with that email already exists." };

  await User.create({
    name,
    email,
    password_hash: await hash(password, 12),
    role: "farmer",
    farm_name: farmName,
    phone,
  });

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created, but sign-in failed. Try logging in." };
    }
    throw error;
  }

  return { error: "" };
}
