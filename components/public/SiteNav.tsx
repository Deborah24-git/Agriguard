import Link from "next/link";
import { Droplets } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { buttonStyles } from "@/components/ui/button";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Droplets className="h-4 w-4" />
          </span>
          AgriGuard
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/#features" className="hover:text-foreground">Features</Link>
          <Link href="/#how-it-works" className="hover:text-foreground">How it works</Link>
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className={buttonStyles("outline", "sm")}>
            Sign in
          </Link>
          <Link href="/register" className={buttonStyles("primary", "sm")}>
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
