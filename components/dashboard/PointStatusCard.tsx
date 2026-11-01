import Link from "next/link";
import { ArrowRight, Droplets, Gauge, Waves } from "lucide-react";
import { StatusPill } from "@/components/ui/StatusPill";
import { Badge } from "@/components/ui/Badge";
import { formatFlow, formatLitres, formatPressure, formatRelative } from "@/lib/format";
import type { PointSnapshot } from "@/types/point";

export function PointStatusCard({ snapshot }: { snapshot: PointSnapshot }) {
  const { point } = snapshot;
  const attention = snapshot.open_alerts > 0;

  return (
    <Link
      href={`/points/${point.id}`}
      className="group glass-card flex flex-col rounded-xl border p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold">{point.name}</p>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {point.code} · {point.crop_type}
          </p>
        </div>
        <StatusPill status={snapshot.status} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-muted/50 p-2">
          <Droplets className="mx-auto h-3.5 w-3.5 text-water" />
          <p className="mt-1 text-[10px] uppercase text-muted-foreground">Flow</p>
          <p className="text-xs font-semibold">{formatFlow(snapshot.flow_rate)}</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-2">
          <Gauge className="mx-auto h-3.5 w-3.5 text-primary" />
          <p className="mt-1 text-[10px] uppercase text-muted-foreground">Pressure</p>
          <p className="text-xs font-semibold">{formatPressure(snapshot.pressure)}</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-2">
          <Waves className="mx-auto h-3.5 w-3.5 text-primary" />
          <p className="mt-1 text-[10px] uppercase text-muted-foreground">Valve</p>
          <p className="text-xs font-semibold capitalize">{snapshot.valve_state ?? "-"}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatLitres(snapshot.litres_today)} today</span>
        {attention ? (
          <Badge variant="danger">{snapshot.open_alerts} open</Badge>
        ) : (
          <span>{snapshot.last_reading_at ? formatRelative(snapshot.last_reading_at) : "no data"}</span>
        )}
      </div>

      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
        Open point <ArrowRight className="h-3 w-3" />
      </span>
    </Link>
  );
}
