import * as React from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  tone?: "default" | "danger" | "warning" | "success";
  className?: string;
}

const TONES = {
  default: "text-primary",
  danger: "text-destructive",
  warning: "text-warning",
  success: "text-success",
};

export function StatsCard({
  title,
  value,
  description,
  icon,
  tone = "default",
  className,
}: StatsCardProps) {
  return (
    <div className={cn("glass-card rounded-xl border p-5 shadow-sm", className)}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        {icon && <span className={cn("shrink-0", TONES[tone])}>{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
