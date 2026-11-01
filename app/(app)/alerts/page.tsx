import { PageHeader } from "@/components/layout/PageHeader";
import { AlertFilterTabs } from "@/components/alerts/AlertFilterTabs";
import { AlertRow } from "@/components/alerts/AlertRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireSessionUser } from "@/lib/session";
import { getAlertFeed } from "@/services/alerts/getAlertFeed";
import { countAlertsByStatus } from "@/services/alerts/countAlertsByStatus";
import type { AlertStatus } from "@/types/alert";

export const metadata = { title: "Alerts" };
export const dynamic = "force-dynamic";

function parseStatus(value: string | undefined): AlertStatus {
  if (value === "acknowledged" || value === "resolved") return value;
  return "open";
}

export default async function AlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const active = parseStatus(status);

  const user = await requireSessionUser();
  const [alerts, counts] = await Promise.all([
    getAlertFeed(user.id, user.role, { status: active, limit: 50 }),
    countAlertsByStatus(user.id, user.role),
  ]);

  return (
    <>
      <PageHeader
        title="Alerts"
        description="Every leak, blockage and tank-level finding, with the reading that triggered it."
      />

      <div className="mb-4">
        <AlertFilterTabs counts={counts} active={active} />
      </div>

      {alerts.length === 0 ? (
        <EmptyState
          title={active === "open" ? "Nothing open right now" : `No ${active} alerts`}
          description={
            active === "open"
              ? "All points are within their expected flow and pressure bands."
              : "Alerts move here once they are acknowledged or resolved."
          }
        />
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <AlertRow key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </>
  );
}
