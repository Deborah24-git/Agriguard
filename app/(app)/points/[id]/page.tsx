import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PointHeader } from "@/components/points/PointHeader";
import { PointMetrics } from "@/components/points/PointMetrics";
import { PointScheduleCard } from "@/components/points/PointScheduleCard";
import { RecentReadingsTable } from "@/components/points/RecentReadingsTable";
import { AlertFeed } from "@/components/dashboard/AlertFeed";
import { FlowChart } from "@/components/charts/FlowChart";
import { SectionCard } from "@/components/ui/SectionCard";
import { formatClock } from "@/lib/format";
import { requireSessionUser } from "@/lib/session";
import { getPointSnapshot } from "@/services/points/getPointSnapshot";
import { getRecentReadings } from "@/services/readings/getRecentReadings";
import { getSeries } from "@/services/readings/getSeries";
import { getPointAlerts } from "@/services/alerts/getPointAlerts";

export const dynamic = "force-dynamic";

export default async function PointDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireSessionUser();
  const snapshot = await getPointSnapshot(id, user.id, user.role);
  if (!snapshot) notFound();

  const point = snapshot.point;
  const [readings, series, alerts] = await Promise.all([
    getRecentReadings(point.id, 8),
    getSeries(point.id, 24),
    getPointAlerts(point.id, point.name, 6),
  ]);

  const points = series.map((reading) => ({
    label: formatClock(reading.recorded_at),
    flow: reading.flow_rate,
  }));

  return (
    <>
      <Link
        href="/points"
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All points
      </Link>

      <PointHeader snapshot={snapshot} />

      <div className="mt-6 space-y-6">
        <PointMetrics snapshot={snapshot} />

        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard
            title="Flow · last 24 hours"
            description="Dashed line is the expected rate for this point"
            className="lg:col-span-2"
          >
            <FlowChart points={points} expected={point.expected_flow_rate} height={200} />
          </SectionCard>
          <SectionCard title="Schedule" description="When this point should be irrigating">
            <PointScheduleCard point={point} />
          </SectionCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Recent readings" description="Newest samples from the flow sensor">
            <RecentReadingsTable readings={readings} />
          </SectionCard>
          <SectionCard title="Point alerts" description="Newest first">
            <AlertFeed alerts={alerts} />
          </SectionCard>
        </div>
      </div>
    </>
  );
}
