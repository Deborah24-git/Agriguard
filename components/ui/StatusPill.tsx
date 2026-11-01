import { cn } from "@/lib/utils";
import type { PointStatus } from "@/types/point";

const STATUS_META: Record<
  PointStatus,
  { label: string; dot: string; chip: string }
> = {
  normal: {
    label: "Healthy",
    dot: "bg-success",
    chip: "bg-success/10 text-success border-success/30",
  },
  irrigating: {
    label: "Irrigating",
    dot: "bg-water",
    chip: "bg-water/10 text-water border-water/30",
  },
  idle: {
    label: "Idle",
    dot: "bg-muted-foreground",
    chip: "bg-muted text-muted-foreground border-border",
  },
  leak: {
    label: "Leak suspected",
    dot: "bg-destructive animate-pulse",
    chip: "bg-destructive/10 text-destructive border-destructive/30",
  },
  blockage: {
    label: "Blockage",
    dot: "bg-warning animate-pulse",
    chip: "bg-warning/10 text-warning border-warning/30",
  },
  pressure_drop: {
    label: "Low pressure",
    dot: "bg-warning",
    chip: "bg-warning/10 text-warning border-warning/30",
  },
  no_flow: {
    label: "No flow",
    dot: "bg-destructive animate-pulse",
    chip: "bg-destructive/10 text-destructive border-destructive/30",
  },
  offline: {
    label: "Offline",
    dot: "bg-muted-foreground",
    chip: "bg-muted text-muted-foreground border-border",
  },
  inactive: {
    label: "Inactive",
    dot: "bg-muted-foreground",
    chip: "bg-muted text-muted-foreground border-border",
  },
};

export function StatusPill({
  status,
  label,
  className,
}: {
  status: PointStatus;
  label?: string;
  className?: string;
}) {
  const meta = STATUS_META[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        meta.chip,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {label ?? meta.label}
    </span>
  );
}

export function statusLabel(status: PointStatus): string {
  return STATUS_META[status].label;
}
