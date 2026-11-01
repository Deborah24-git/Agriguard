import { redirect } from "next/navigation";
import { Sprout } from "lucide-react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { getSessionUser } from "@/lib/session";

export const metadata = { title: "Create account" };

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-16">
      <div className="mb-6 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Sprout className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">Register your farm</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create an account, then add Points A to E and their sensors.
        </p>
      </div>

      <div className="glass-card rounded-xl border p-6">
        <RegisterForm />
      </div>
    </div>
  );
}
