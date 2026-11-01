import { cn } from "@/lib/utils";
import { formatClock } from "@/lib/format";
import { REFILL_THRESHOLD_PCT, type TankTrendPoint } from "@/types/tank";

interface Props {
  points: TankTrendPoint[];
  height?: number;
  className?: string;
}

/** Dependency-free line chart of the smart tank fill, with the refill line. */
export function TankTrendChart({ points, height = 180, className }: Props) {
  if (points.length < 2) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted/40 text-sm text-muted-foreground",
          className
        )}
        style={{ height }}
      >
        Not enough level readings to draw the tank trend yet.
      </div>
    );
  }

  const width = 600;
  const padding = 8;
  const x = (index: number) =>
    padding + (index / (points.length - 1)) * (width - padding * 2);
  const y = (pct: number) =>
    height - padding - (Math.max(0, Math.min(100, pct)) / 100) * (height - padding * 2);

  const line = points.map((point, index) => `${x(index)},${y(point.level_pct)}`).join(" ");
  const area = `${padding},${height - padding} ${line} ${width - padding},${height - padding}`;
  const latest = points[points.length - 1];

  return (
    <div className={className}>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-2xl font-bold">{latest.level_pct}%</p>
        <p className="text-[11px] text-muted-foreground">Refill line {REFILL_THRESHOLD_PCT}%</p>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full text-water"
        style={{ height }}
        role="img"
        aria-label="Smart tank water level trend"
      >
        <defs>
          <linearGradient id="tank-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.32" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {[25, 50, 75].map((pct) => (
          <line
            key={pct}
            x1={padding}
            x2={width - padding}
            y1={y(pct)}
            y2={y(pct)}
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeWidth="1"
          />
        ))}

        <line
          x1={padding}
          x2={width - padding}
          y1={y(REFILL_THRESHOLD_PCT)}
          y2={y(REFILL_THRESHOLD_PCT)}
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeDasharray="6 5"
          className="text-destructive"
          strokeWidth="1.5"
        />

        <polygon points={area} fill="url(#tank-fill)" />
        <polyline
          points={line}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>{formatClock(points[0].recorded_at)}</span>
        <span>{formatClock(latest.recorded_at)}</span>
      </div>
    </div>
  );
}
