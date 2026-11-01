import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/ui/SectionCard";
import { UsageSummaryCards } from "@/components/reports/UsageSummaryCards";
import { UsageBarChart } from "@/components/charts/UsageBarChart";
import { LossCard } from "@/components/reports/LossCard";
import { PointUsageTable } from "@/components/reports/PointUsageTable";
import { PointHistoryTable } from "@/components/reports/PointHistoryTable";
import { requireSessionUser } from "@/lib/session";
import { loadPointRanges } from "@/services/reports/loadPointRanges";
import { computeDailyUsage } from "@/services/reports/computeDailyUsage";
import {
  computeLossEstimate,
  computePointUsage,
} from "@/services/reports/computePointUsage";
import { collectNamedSessions } from "@/services/reports/collectNamedSessions";
import { computeUsageTotals } from "@/services/reports/computeUsageTotals";
import { cn } from "@/lib/utils";

export const metadata = { title: "Water reports" };
export const dynamic = "force-dynamic";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range } = await searchParams;
  const days = range === "30" ? 30 : 7;

  const user = await requireSessionUser();
  const ranges = await loadPointRanges(user.id, user.role, days);

  const daily = computeDailyUsage(ranges, days);
  const loss = computeLossEstimate(ranges);
  const usage = computePointUsage(ranges);
  const sessions = collectNamedSessions(ranges, 12);
  const totals = computeUsageTotals(daily, sessions.length);

  return (
    <>
      <PageHeader
        title="Water usage reports"
        description="Water consumption, suspected losses and delivery history across points A to E."
        actions={
          <div className="flex gap-2">
            {[7, 30].map((option) => (
              <Link
                key={option}
                href={`/reports?range=${option}`}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  days === option
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                )}
              >
                Last {option} days
              </Link>
            ))}
          </div>
        }
      />

      <div className="space-y-6">
        <UsageSummaryCards totals={totals} lossLitres={loss.total_litres} days={days} />

        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard
            title={`Daily consumption · ${days} days`}
            description="Total metered volume per day; red is water lost to leaks or shortfall."
            className="lg:col-span-2"
          >
            <UsageBarChart days={daily} height={200} />
          </SectionCard>

          <SectionCard
            title="Where the water went"
            description="Leak volume versus delivery shortfall"
          >
            <LossCard loss={loss} />
          </SectionCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Usage by point" description={`Metered volume, last ${days} days`}>
            <PointUsageTable
              points={ranges.map((entry) => entry.point)}
              usage={usage}
              days={days}
            />
          </SectionCard>
          <SectionCard title="Water delivery history" description="Most recent completed runs">
            <PointHistoryTable sessions={sessions} />
          </SectionCard>
        </div>
      </div>
    </>
  );
}
