import { Gauge, RadioTower } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatLitres, formatRelative } from "@/lib/format";
import { REFILL_THRESHOLD_PCT, type TankLevelDTO } from "@/types/tank";

export function TankGauge({
  level,
  size = "md",
}: {
  level: TankLevelDTO;
  size?: "md" | "sm";
}) {
  const low = level.needs_refill;
  const showThreshold = level.asset === "tank";

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        low ? "border-destructive/40 bg-destructive/5" : "border-border bg-card/60",
        size === "sm" && "p-3"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={cn("font-semibold", size === "sm" ? "text-sm" : "text-base")}>
            {level.label}
          </p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Ultrasonic level · {formatLitres(level.capacity_litres)}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
            level.asset === "tank"
              ? "bg-water/10 text-water"
              : "bg-primary/10 text-primary"
          )}
        >
          <RadioTower className="h-3 w-3" />
          {level.asset === "tank" ? "Smart tank" : "Standpipe"}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <p className={cn("font-bold tracking-tight", size === "sm" ? "text-2xl" : "text-4xl")}>
          {level.level_pct}%
        </p>
        <p className="text-xs text-muted-foreground">
          {low ? "Needs refill" : "Level healthy"}
        </p>
      </div>

      <div className="relative mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-[width]",
            low ? "bg-destructive" : level.asset === "tank" ? "bg-water" : "bg-primary"
          )}
          style={{ width: `${Math.max(0, Math.min(100, level.level_pct))}%` }}
        />
        {showThreshold && (
          <span
            title={`Refill threshold ${REFILL_THRESHOLD_PCT}%`}
            className="absolute top-0 h-full w-0.5 bg-foreground/40"
            style={{ left: `${REFILL_THRESHOLD_PCT}%` }}
          />
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Gauge className="h-3 w-3" />
          Refill under {level.refill_threshold_pct}%
        </span>
        <span>
          {level.last_reading_at ? formatRelative(level.last_reading_at) : "no reading"}
        </span>
      </div>
    </div>
  );
}
