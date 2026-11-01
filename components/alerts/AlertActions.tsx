import { Check, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { acknowledgeAlert } from "@/actions/alerts/acknowledgeAlert";
import { resolveAlert } from "@/actions/alerts/resolveAlert";
import type { AlertDTO } from "@/types/alert";

/** Status controls backed by real server actions. */
export function AlertActions({ alert }: { alert: AlertDTO }) {
  if (alert.status === "resolved") {
    return <p className="text-xs text-success">Resolved</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {alert.status === "open" && (
        <form action={acknowledgeAlert}>
          <input type="hidden" name="alert_id" value={alert.id} />
          <Button type="submit" variant="outline" size="sm">
            <Check className="h-3.5 w-3.5" /> Acknowledge
          </Button>
        </form>
      )}
      <form action={resolveAlert}>
        <input type="hidden" name="alert_id" value={alert.id} />
        <Button type="submit" variant="primary" size="sm">
          <CircleCheck className="h-3.5 w-3.5" /> Resolve
        </Button>
      </form>
    </div>
  );
}
