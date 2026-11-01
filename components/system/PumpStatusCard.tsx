import { Cog, Droplets, Gauge, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PumpStatus } from "@/types/system";

const STATE_STYLE = {
  running: "bg-success/10 text-success border-success/30",
  idle: "bg-muted text-muted-foreground border-border",
  fault: "bg-destructive/10 text-destructive border-destructive/30",
} as const;

export function PumpStatusCard({ pump }: { pump: PumpStatus }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold">Borehole pump</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Supply line to the smart tank
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize",
            STATE_STYLE[pump.state]
          )}
        >
          <Cog className={cn("h-3 w-3", pump.state === "running" && "animate-spin")} />
          {pump.state}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-muted/50 px-2.5 py-2">
          <p className="inline-flex items-center gap-1 text-[10px] uppercase text-muted-foreground">
            <Droplets className="h-3 w-3 text-water" /> Flow
          </p>
          <p className="font-semibold">{pump.flow_rate} L/min</p>
        </div>
        <div className="rounded-lg bg-muted/50 px-2.5 py-2">
          <p className="inline-flex items-center gap-1 text-[10px] uppercase text-muted-foreground">
            <Gauge className="h-3 w-3 text-primary" /> Pressure
          </p>
          <p className="font-semibold">{pump.pressure_kpa} kPa</p>
        </div>
      </div>

      <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
        <Timer className="h-3 w-3" />
        {Math.round(pump.runtime_minutes_today / 60)} h {pump.runtime_minutes_today % 60} m runtime today
      </p>
    </div>
  );
}
