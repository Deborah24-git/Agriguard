import Link from "next/link";
import { redirect } from "next/navigation";
import { Droplets } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { getSessionUser } from "@/lib/session";

export const metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const target = next && next.startsWith("/") ? next : "/dashboard";

  const user = await getSessionUser();
  if (user) redirect(target);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-16">
      <div className="mb-6 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Droplets className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to watch points A to E, the smart tank and your alerts.
        </p>
      </div>

      <div className="glass-card rounded-xl border p-6">
        <LoginForm next={target} />
      </div>

      <p className="mt-4 rounded-md border border-border bg-muted/40 px-3 py-2 text-center text-[11px] text-muted-foreground">
        Demo accounts: farmer@agriguard.test or admin@agriguard.test ·
        password123
      </p>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          ← Back to the overview
        </Link>
      </p>
    </div>
  );
}
