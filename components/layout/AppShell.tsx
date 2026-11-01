"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Sidebar } from "./Sidebar";

interface Props {
  children: React.ReactNode;
  userName: string;
  farmName: string;
  alertCount: number;
  role: string;
}

export function AppShell({ children, userName, farmName, alertCount, role }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [lastPath, setLastPath] = useState(pathname);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("agriguard_sidebar_collapsed") === "true";
      // Hydration-safe: the server always renders expanded, so the stored
      // preference is applied on the client after mount.
      setCollapsed(stored);
    } catch {
      // ignore storage failures
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (lastPath !== pathname) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLastPath(pathname);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMobileOpen(false);
    }
  }, [lastPath, pathname]);

  function toggle() {
    setCollapsed((current) => {
      const next = !current;
      try {
        localStorage.setItem("agriguard_sidebar_collapsed", String(next));
      } catch {
        // ignore storage failures
      }
      return next;
    });
  }

  const isCollapsed = collapsed && mounted;

  return (
    <div className="flex min-h-screen bg-background">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        isCollapsed={isCollapsed}
        mobileOpen={mobileOpen}
        userName={userName}
        farmName={farmName}
        alertCount={alertCount}
        role={role}
        onToggle={toggle}
        onMobileToggle={() => setMobileOpen((open) => !open)}
      />

      <main
        className={cn(
          "relative min-h-screen flex-1 transition-[margin] duration-200",
          isCollapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
        <div className="pointer-events-none absolute right-0 top-0 -z-10 h-1/2 w-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
          <div className="mb-6 flex items-center justify-end gap-3">
            <ThemeToggle />
            <div className="hidden flex-col items-end sm:flex">
              <span className="text-sm font-semibold">{userName}</span>
              <span className="text-[10px] uppercase tracking-wider text-primary">
                {farmName}
              </span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
