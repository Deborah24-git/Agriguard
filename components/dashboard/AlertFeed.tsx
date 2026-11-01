import Link from "next/link";
import { BellRing, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatRelative } from "@/lib/format";
import type { AlertDTO } from "@/types/alert";

const SEVERITY_VARIANT = {
  critical: "danger",
  warning: "warning",
  info: "info",
} as const;

export function AlertFeed({
  alerts,
  compact = false,
}: {
  alerts: AlertDTO[];
  compact?: boolean;
}) {
  if (alerts.length === 0) {
    return (
      <EmptyState
        title="No open alerts"
        description="When a leak, blockage or low tank level is suspected it will appear here."
        icon={<BellRing className="h-5 w-5" />}
      />
    );
  }

  return (
    <ul className="divide-y divide-border">
      {alerts.map((alert) => (
        <li key={alert.id}>
          <Link
            href={alert.point_id ? `/points/${alert.point_id}` : "/alerts"}
            className="flex items-start gap-3 py-3 transition-colors hover:bg-muted/40"
          >
            <span className="mt-1.5">
              <Badge variant={SEVERITY_VARIANT[alert.severity]}>
                {alert.severity}
              </Badge>
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{alert.title}</p>
              {!compact && (
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                  {alert.message}
                </p>
              )}
              <p className="mt-1 text-[11px] text-muted-foreground">
                {alert.point_name} · {formatRelative(alert.detected_at)}
                {alert.status !== "open" && ` · ${alert.status}`}
              </p>
            </div>
            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
