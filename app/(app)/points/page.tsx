import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PointCard } from "@/components/points/PointCard";
import { PointMap } from "@/components/points/PointMap";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonStyles } from "@/components/ui/button";
import { requireSessionUser } from "@/lib/session";
import { getPointSnapshots } from "@/services/points/getPointSnapshots";

export const metadata = { title: "Points" };
export const dynamic = "force-dynamic";

export default async function PointsPage() {
  const user = await requireSessionUser();
  const snapshots = await getPointSnapshots(user.id, user.role);

  return (
    <>
      <PageHeader
        title="Irrigation points"
        description="Points A to E, their baselines and current health, fed from the smart tank."
        actions={
          <Link href="/points/new" className={buttonStyles("primary", "sm")}>
            <Plus className="h-4 w-4" /> Add point
          </Link>
        }
      />

      {snapshots.length === 0 ? (
        <EmptyState
          title="No points registered"
          description="Add an irrigation point and set its expected flow and pressure."
          action={
            <Link href="/points/new" className={buttonStyles("primary", "sm")}>
              Add your first point
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          <PointMap snapshots={snapshots} />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {snapshots.map((snapshot) => (
              <PointCard key={snapshot.point.id} snapshot={snapshot} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
