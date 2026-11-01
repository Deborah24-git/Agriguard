import Link from "next/link";
import { Pencil } from "lucide-react";
import { StatusPill } from "@/components/ui/StatusPill";
import { buttonStyles } from "@/components/ui/button";
import { DeletePointButton } from "./DeletePointButton";
import type { PointSnapshot } from "@/types/point";

export function PointHeader({ snapshot }: { snapshot: PointSnapshot }) {
  const { point } = snapshot;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{point.name}</h1>
          <StatusPill status={snapshot.status} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-mono uppercase">{point.code}</span> · {point.crop_type} ·{" "}
          {point.area_hectares} ha
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Baseline {point.expected_flow_rate} L/min · {point.min_pressure}-
          {point.max_pressure} kPa · starts {point.schedule.start_time}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link href={`/points/${point.id}/edit`} className={buttonStyles("outline", "sm")}>
          <Pencil className="h-4 w-4" /> Edit
        </Link>
        <DeletePointButton pointId={point.id} pointName={point.name} />
      </div>
    </div>
  );
}
