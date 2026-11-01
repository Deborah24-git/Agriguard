"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  isCollapsed: boolean;
  badge?: number;
}

export function SidebarNavItem({
  href,
  label,
  icon: Icon,
  isActive,
  isCollapsed,
  badge = 0,
}: Props) {
  return (
    <Link
      href={href}
      title={isCollapsed ? label : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-lg py-2.5 text-sm transition-colors",
        isCollapsed ? "justify-center px-0" : "px-3",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span className="truncate">{label}</span>}
      {badge > 0 && (
        <span
          className={cn(
            "flex min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
            isCollapsed && "absolute right-1 top-1",
            isActive
              ? "bg-primary-foreground text-primary"
              : "bg-destructive text-destructive-foreground"
          )}
        >
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}
