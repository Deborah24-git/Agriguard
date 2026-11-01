"use client";

import { useActionState } from "react";
import Link from "next/link";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { registerUser } from "@/actions/auth/registerUser";
import type { AuthFormState } from "@/types/auth";

const INITIAL: AuthFormState = { error: "" };

export function RegisterForm() {
  const [state, formAction] = useActionState(registerUser, INITIAL);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <FormField label="Full name" htmlFor="name" required>
        <input
          id="name"
          name="name"
          autoComplete="name"
          className="form-input"
          placeholder="Thandi Nkosi"
          required
        />
      </FormField>

      <FormField label="Farm name" htmlFor="farm_name">
        <input
          id="farm_name"
          name="farm_name"
          className="form-input"
          placeholder="Riverside Farm"
        />
      </FormField>

      <FormField label="Email" htmlFor="email" required>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="form-input"
          placeholder="you@farm.test"
          required
        />
      </FormField>

      <FormField
        label="Alert phone"
        htmlFor="phone"
        hint="Used for SMS alerts through Africa's Talking."
      >
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className="form-input"
          placeholder="+27821234567"
        />
      </FormField>

      <FormField
        label="Password"
        htmlFor="password"
        required
        hint="At least 8 characters."
      >
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          className="form-input"
          minLength={8}
          required
        />
      </FormField>

      <SubmitButton className="w-full justify-center" pendingLabel="Creating account">
        Create account
      </SubmitButton>

      <p className="text-center text-xs text-muted-foreground">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
