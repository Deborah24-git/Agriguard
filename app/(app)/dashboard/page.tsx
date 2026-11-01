import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/ui/SectionCard";
import { DemoBadge } from "@/components/dashboard/DemoBadge";
import { DashboardLive } from "@/components/dashboard/DashboardLive";
import { SimulateButton } from "@/components/dashboard/SimulateButton";
import { DashboardSmsActivity } from "@/components/dashboard/DashboardSmsActivity";
import { UsageBarChart } from "@/components/charts/UsageBarChart";
import { requireSessionUser } from "@/lib/session";
import { getLivePayload } from "@/services/system/getLivePayload";
import { getSmsLog } from "@/services/notifications/getSmsLog";
import { loadPointRanges } from "@/services/reports/loadPointRanges";
import { computeDailyUsage } from "@/services/reports/computeDailyUsage";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireSessionUser();

  const [payload, ranges, smsLog] = await Promise.all([
    getLivePayload(user.id, user.role),
    loadPointRanges(user.id, user.role, 7),
    getSmsLog(5),
  ]);

  const trend = computeDailyUsage(ranges, 7);
  const firstName = user.name.split(" ")[0];

  return (
    <>
      <PageHeader
        title={`Good day, ${firstName}`}
        description="Live flow, pressure and tank levels from the borehole, smart tank and irrigation points."
        actions={
          <>
            <DemoBadge generatedAt={payload.generated_at} />
            <SimulateButton />
          </>
        }
      />

      <div className="space-y-6">
        <DashboardLive initial={payload} />
        <DashboardSmsActivity messages={smsLog} />

        <SectionCard
          title="Water use · 7 days"
          description="Bars show total volume; red is suspected loss"
          actions={
            <Link
              href="/reports"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Reports <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          <UsageBarChart days={trend} height={160} />
        </SectionCard>
      </div>
    </>
  );
}
