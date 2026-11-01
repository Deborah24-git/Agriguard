import { StatsCard } from "@/components/ui/StatsCard";
import { Droplets, Gauge, Waves, Clock } from "lucide-react";
import { formatFlow, formatLitres, formatPressure, formatRelative } from "@/lib/format";
import type { PointSnapshot } from "@/types/point";

export function PointMetrics({ snapshot }: { snapshot: PointSnapshot }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Live flow"
        value={formatFlow(snapshot.flow_rate)}
        description={`Expected ${snapshot.point.expected_flow_rate} L/min`}
        icon={<Droplets className="h-4 w-4" />}
      />
      <StatsCard
        title="Live pressure"
        value={formatPressure(snapshot.pressure)}
        description={`Safe band ${snapshot.point.min_pressure}-${snapshot.point.max_pressure} kPa`}
        icon={<Gauge className="h-4 w-4" />}
      />
      <StatsCard
        title="Valve state"
        value={snapshot.valve_state ? snapshot.valve_state : "Unknown"}
        description="Current actuator position"
        icon={<Waves className="h-4 w-4" />}
      />
      <StatsCard
        title="Water today"
        value={formatLitres(snapshot.litres_today)}
        description={
          snapshot.last_reading_at
            ? `Last reading ${formatRelative(snapshot.last_reading_at)}`
            : "No readings yet"
        }
        icon={<Clock className="h-4 w-4" />}
      />
    </div>
  );
}
