import { Activity, BellRing, Droplets, TriangleAlert } from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
import { formatLitres } from "@/lib/format";
import type { PointsSummary } from "@/types/point";

export function SummaryStats({ summary }: { summary: PointsSummary }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Points monitored"
        value={summary.total_points}
        description={`${summary.healthy} healthy · ${summary.offline} offline`}
        icon={<Activity className="h-4 w-4" />}
      />
      <StatsCard
        title="Need attention"
        value={summary.attention}
        description="Leak, blockage, pressure or no flow"
        tone={summary.attention > 0 ? "danger" : "success"}
        icon={<TriangleAlert className="h-4 w-4" />}
      />
      <StatsCard
        title="Open alerts"
        value={summary.open_alerts}
        description="Unresolved findings"
        tone={summary.open_alerts > 0 ? "warning" : "success"}
        icon={<BellRing className="h-4 w-4" />}
      />
      <StatsCard
        title="Water used today"
        value={formatLitres(summary.litres_today)}
        description="Across all points since midnight"
        icon={<Droplets className="h-4 w-4" />}
      />
    </div>
  );
}
