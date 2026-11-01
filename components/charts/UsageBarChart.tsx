import { formatLitres } from "@/lib/format";
import type { DailyUsage } from "@/types/report";

interface Props {
  days: DailyUsage[];
  height?: number;
  className?: string;
}

function dayLabel(iso: string): string {
  const date = new Date(`${iso}T12:00:00`);
  return date.toLocaleDateString("en-ZA", { weekday: "short" });
}

/** Stacked bars: total volume, with the loss portion highlighted in red. */
export function UsageBarChart({ days, height = 160, className }: Props) {
  const peak = Math.max(1, ...days.map((day) => day.litres));

  return (
    <div className={className}>
      <div className="flex items-end gap-2" style={{ height }}>
        {days.map((day) => {
          const totalHeight = Math.max(2, (day.litres / peak) * 100);
          const lossShare = day.litres > 0 ? day.lost_litres / day.litres : 0;

          return (
            <div key={day.date} className="group flex h-full flex-1 flex-col justify-end">
              <div
                className="relative w-full overflow-hidden rounded-t-md bg-primary/25"
                style={{ height: `${totalHeight}%` }}
                title={`${dayLabel(day.date)}: ${formatLitres(day.litres)} (${formatLitres(day.lost_litres)} lost)`}
              >
                <div
                  className="absolute inset-x-0 bottom-0 bg-destructive/70"
                  style={{ height: `${Math.min(100, lossShare * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex gap-2">
        {days.map((day) => (
          <div key={day.date} className="flex-1 text-center text-[10px] text-muted-foreground">
            {dayLabel(day.date)}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-primary/40" /> Used
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-destructive/70" /> Suspected loss
        </span>
        <span className="ml-auto">Peak day {formatLitres(peak)}</span>
      </div>
    </div>
  );
}
