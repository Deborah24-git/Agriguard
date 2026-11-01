import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { AlertActions } from "./AlertActions";
import { formatFlow, formatPressure, formatRelative } from "@/lib/format";
import { ALERT_TYPE_LABELS, type AlertDTO } from "@/types/alert";

const SEVERITY_VARIANT = {
  critical: "danger",
  warning: "warning",
  info: "info",
} as const;

const SMS_LABEL = {
  sent: "SMS sent",
  failed: "SMS failed",
  skipped: "SMS skipped",
} as const;

export function AlertRow({ alert }: { alert: AlertDTO }) {
  return (
    <article className="glass-card rounded-xl border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge variant={SEVERITY_VARIANT[alert.severity]}>{alert.severity}</Badge>
            <Badge variant="muted">{ALERT_TYPE_LABELS[alert.type]}</Badge>
            <Badge variant={alert.status === "resolved" ? "success" : "muted"}>
              {alert.status}
            </Badge>
            {alert.sms_status && (
              <Badge variant={alert.sms_status === "sent" ? "info" : "muted"}>
                {SMS_LABEL[alert.sms_status]}
              </Badge>
            )}
          </div>
          <h3 className="font-semibold leading-snug">{alert.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>
        </div>
        <div className="text-right text-[11px] text-muted-foreground">
          <p>{formatRelative(alert.detected_at)}</p>
          {alert.point_id ? (
            <Link
              href={`/points/${alert.point_id}`}
              className="font-semibold text-primary hover:underline"
            >
              {alert.point_name}
            </Link>
          ) : (
            <span className="font-semibold">{alert.point_name}</span>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
        <span>Flow at detection: <strong>{formatFlow(alert.flow_rate)}</strong></span>
        <span>Pressure: <strong>{formatPressure(alert.pressure)}</strong></span>
        <span className="ml-auto">
          <AlertActions alert={alert} />
        </span>
      </div>
    </article>
  );
}
