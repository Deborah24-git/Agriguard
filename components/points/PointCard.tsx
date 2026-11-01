import Link from "next/link";
import { Droplets, Gauge, MapPin, Waves } from "lucide-react";
import { StatusPill } from "@/components/ui/StatusPill";
import { Badge } from "@/components/ui/Badge";
import { formatFlow, formatPressure } from "@/lib/format";
import type { PointSnapshot } from "@/types/point";

const DAY_INITIALS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function PointCard({ snapshot }: { snapshot: PointSnapshot }) {
  const { point } = snapshot;

  return (
    <Link
      href={`/points/${point.id}`}
      className="glass-card flex flex-col rounded-xl border p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold">{point.name}</p>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {point.code} · {point.area_hectares} ha · {point.crop_type}
          </p>
        </div>
        <StatusPill status={snapshot.status} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-2.5 py-2">
          <Droplets className="h-3.5 w-3.5 shrink-0 text-water" />
          <div>
            <dt className="text-[10px] uppercase text-muted-foreground">Flow</dt>
            <dd className="font-semibold">{formatFlow(snapshot.flow_rate)}</dd>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-2.5 py-2">
          <Gauge className="h-3.5 w-3.5 shrink-0 text-primary" />
          <div>
            <dt className="text-[10px] uppercase text-muted-foreground">Pressure</dt>
            <dd className="font-semibold">{formatPressure(snapshot.pressure)}</dd>
          </div>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Waves className="h-3 w-3" /> {point.expected_flow_rate} L/min expected
        </span>
        <span className="inline-flex items-center gap-1">
          <Gauge className="h-3 w-3" /> {point.min_pressure}-{point.max_pressure} kPa
        </span>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        {DAY_INITIALS.map((day, index) => (
          <span
            key={day}
            className={
              point.schedule.active_days.includes(index)
                ? "rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary"
                : "rounded px-1.5 py-0.5 text-[10px] text-muted-foreground/50"
            }
          >
            {day.charAt(0)}
          </span>
        ))}
        <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {point.schedule.start_time}
        </span>
      </div>

      {snapshot.open_alerts > 0 && (
        <div className="mt-3">
          <Badge variant="danger">{snapshot.open_alerts} open alert(s)</Badge>
        </div>
      )}
    </Link>
  );
}
