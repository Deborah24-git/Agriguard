import { cn } from "@/lib/utils";

export interface FlowPoint {
  label: string;
  flow: number;
}

interface FlowChartProps {
  points: FlowPoint[];
  expected?: number;
  height?: number;
  className?: string;
}

/**
 * Dependency-free flow line. Renders in the server component tree, so the
 * dashboard ships no charting library to the browser.
 */
export function FlowChart({ points, expected, height = 180, className }: FlowChartProps) {
  if (points.length < 2) {
    return (
      <div
        className={cn("flex items-center justify-center rounded-lg bg-muted/40 text-sm text-muted-foreground", className)}
        style={{ height }}
      >
        Not enough readings to draw a trend yet.
      </div>
    );
  }

  const width = 600;
  const padding = 8;
  const maxFlow = Math.max(
    expected ?? 0,
    ...points.map((point) => point.flow)
  );
  const ceiling = maxFlow === 0 ? 1 : maxFlow * 1.15;

  const x = (index: number) =>
    padding + (index / (points.length - 1)) * (width - padding * 2);
  const y = (flow: number) =>
    height - padding - (flow / ceiling) * (height - padding * 2);

  const line = points.map((point, index) => `${x(index)},${y(point.flow)}`).join(" ");
  const area = `${padding},${height - padding} ${line} ${width - padding},${height - padding}`;

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-full w-full text-primary"
        style={{ height }}
        role="img"
        aria-label="Water flow over time"
      >
        <defs>
          <linearGradient id="flow-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((fraction) => (
          <line
            key={fraction}
            x1={padding}
            x2={width - padding}
            y1={y(ceiling * fraction)}
            y2={y(ceiling * fraction)}
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeWidth="1"
          />
        ))}

        {typeof expected === "number" && expected > 0 && (
          <line
            x1={padding}
            x2={width - padding}
            y1={y(expected)}
            y2={y(expected)}
            stroke="currentColor"
            strokeOpacity="0.45"
            strokeDasharray="6 5"
            strokeWidth="1.5"
          />
        )}

        <polygon points={area} fill="url(#flow-fill)" className="text-primary" />
        <polyline
          points={line}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          className="text-primary"
        />
      </svg>

      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>{points[0].label}</span>
        <span>{points[points.length - 1].label}</span>
      </div>
    </div>
  );
}
