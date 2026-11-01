"use client";

import { useActionState } from "react";
import Link from "next/link";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { loginUser } from "@/actions/auth/loginUser";
import type { AuthFormState } from "@/types/auth";

const INITIAL: AuthFormState = { error: "" };

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState(loginUser, INITIAL);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      {state.error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <FormField label="Email" htmlFor="email" required>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="form-input"
          placeholder="farmer@agriguard.test"
          required
        />
      </FormField>

      <FormField label="Password" htmlFor="password" required>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="form-input"
          placeholder="••••••••"
          required
        />
      </FormField>

      <SubmitButton className="w-full justify-center" pendingLabel="Signing in">
        Sign in
      </SubmitButton>

      <p className="text-center text-xs text-muted-foreground">
        No account yet?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Register your farm
        </Link>
      </p>
    </form>
  );
}
