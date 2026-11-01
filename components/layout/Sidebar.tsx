"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Droplets,
  RadioTower,
  BellRing,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarNotificationButton } from "./SidebarNotificationButton";
import { logoutUser } from "@/actions/auth/logoutUser";

interface Props {
  isCollapsed: boolean;
  mobileOpen: boolean;
  userName: string;
  farmName: string;
  alertCount: number;
  role: string;
  onToggle: () => void;
  onMobileToggle: () => void;
}

export function Sidebar({
  isCollapsed,
  mobileOpen,
  userName,
  farmName,
  alertCount,
  role,
  onToggle,
  onMobileToggle,
}: Props) {
  const pathname = usePathname();

  const nav = [
    { href: "/dashboard", label: "Live monitoring", icon: LayoutDashboard, badge: 0 },
    { href: "/points", label: "Points A-E", icon: Droplets, badge: 0 },
    { href: "/sensors", label: "Sensors", icon: RadioTower, badge: 0 },
    { href: "/alerts", label: "Alerts", icon: BellRing, badge: alertCount },
    { href: "/reports", label: "Water reports", icon: BarChart3, badge: 0 },
    { href: "/settings", label: "Settings", icon: Settings, badge: 0 },
  ];

  return (
    <>
      <button
        className="fixed left-4 top-4 z-[60] flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card shadow-sm md:hidden"
        onClick={onMobileToggle}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col",
          "glass-card border-r transition-all duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
          isCollapsed ? "md:w-16" : "md:w-64"
        )}
      >
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-primary/10",
            isCollapsed ? "justify-center px-2" : "justify-between px-5"
          )}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Droplets className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-bold tracking-tight">AgriGuard</p>
                <p className="max-w-[8rem] truncate text-[10px] uppercase tracking-widest text-muted-foreground">
                  {farmName}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={onToggle}
            className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground md:flex"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className={cn("flex-1 space-y-1 overflow-y-auto py-4", isCollapsed ? "px-2" : "px-3")}>
          {nav.map((item) => (
            <SidebarNavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              badge={item.badge}
              isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
              isCollapsed={isCollapsed}
            />
          ))}
          <div className={cn("pt-3", isCollapsed ? "px-1" : "px-0")}>
            {!isCollapsed && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Notifications
              </p>
            )}
            <SidebarNotificationButton isCollapsed={isCollapsed} />
          </div>
        </nav>

        <div className="mt-auto shrink-0 space-y-2 border-t border-primary/10 p-3">
          {!isCollapsed && (
            <div className="rounded-lg bg-secondary/60 px-3 py-2">
              <p className="truncate text-sm font-semibold">{userName}</p>
              <p className="text-[10px] uppercase tracking-wider text-primary">
                {role === "admin" ? "Administrator" : "Farm owner"}
              </p>
            </div>
          )}
          <form action={logoutUser}>
            <button
              type="submit"
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
                isCollapsed && "justify-center px-0"
              )}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>Sign out</span>}
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
