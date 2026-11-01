import Link from "next/link";
import { formatLitres } from "@/lib/format";
import { EmptyState } from "@/components/ui/EmptyState";
import type { PointDTO } from "@/types/point";

interface Props {
  points: PointDTO[];
  usage: Map<string, number>;
  days: number;
}

function barShare(litres: number, peak: number): number {
  return peak === 0 ? 0 : Math.max(2, Math.round((litres / peak) * 100));
}

export function PointUsageTable({ points, usage, days }: Props) {
  if (points.length === 0) {
    return <EmptyState title="No points to report on" />;
  }

  const peak = Math.max(...points.map((point) => usage.get(point.id) ?? 0));

  return (
    <div className="space-y-3">
      {points.map((point) => {
        const litres = usage.get(point.id) ?? 0;
        return (
          <div key={point.id} className="space-y-1.5">
            <div className="flex items-baseline justify-between text-sm">
              <Link
                href={`/points/${point.id}`}
                className="font-medium hover:text-primary hover:underline"
              >
                {point.name}
                <span className="ml-2 text-[11px] uppercase text-muted-foreground">
                  {point.code}
                </span>
              </Link>
              <span className="font-semibold">{formatLitres(litres)}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary/70"
                style={{ width: `${barShare(litres, peak)}%` }}
              />
            </div>
          </div>
        );
      })}
      <p className="pt-1 text-[11px] text-muted-foreground">
        Last {days} days · bar length is relative to the highest-using point.
      </p>
    </div>
  );
}
