import Link from "next/link";
import { RadioTower } from "lucide-react";
import { PointStatusCard } from "./PointStatusCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonStyles } from "@/components/ui/button";
import type { PointSnapshot } from "@/types/point";

/** Live view of every point. Refreshed by the dashboard poll. */
export function LiveMonitor({ snapshots }: { snapshots: PointSnapshot[] }) {
  if (snapshots.length === 0) {
    return (
      <EmptyState
        title="No points registered yet"
        description="Add an irrigation point to start monitoring water flow and pressure."
        action={
          <Link href="/points/new" className={buttonStyles("primary", "sm")}>
            Add a point
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <RadioTower className="h-3 w-3 text-success" />
        Flow, pressure and valve state from the field sensors.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {snapshots.map((snapshot) => (
          <PointStatusCard key={snapshot.point.id} snapshot={snapshot} />
        ))}
      </div>
    </div>
  );
}
