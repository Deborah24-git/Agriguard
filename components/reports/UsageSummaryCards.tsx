import { Clock, Droplets, TriangleAlert, Waves } from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
import { formatLitres } from "@/lib/format";
import type { UsageTotals } from "@/types/report";

interface Props {
  totals: UsageTotals;
  lossLitres: number;
  days: number;
}

export function UsageSummaryCards({ totals, lossLitres, days }: Props) {
  const lossShare =
    totals.litres + lossLitres > 0
      ? Math.round((lossLitres / (totals.litres + lossLitres)) * 100)
      : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title={`Water used (${days} days)`}
        value={formatLitres(totals.litres)}
        description="Metered volume across all points"
        icon={<Droplets className="h-4 w-4" />}
      />
      <StatsCard
        title="Suspected losses"
        value={formatLitres(lossLitres)}
        description={`${lossShare}% of metered volume`}
        tone={lossLitres > 0 ? "danger" : "success"}
        icon={<TriangleAlert className="h-4 w-4" />}
      />
      <StatsCard
        title="Irrigation time"
        value={`${Math.round(totals.irrigation_minutes / 60)} h`}
        description={`${totals.irrigation_minutes} valve-open minutes`}
        icon={<Clock className="h-4 w-4" />}
      />
      <StatsCard
        title="Irrigation sessions"
        value={totals.sessions}
        description="Completed runs in this period"
        icon={<Waves className="h-4 w-4" />}
      />
    </div>
  );
}
