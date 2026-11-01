import { AlertTriangle, CheckCircle2, RadioTower } from "lucide-react";
import { SectionCard } from "@/components/ui/SectionCard";
import { PumpStatusCard } from "./PumpStatusCard";
import { TankGauge } from "./TankGauge";
import type { SystemOverview as SystemOverviewData } from "@/types/system";

/**
 * Borehole pump → smart tank → standpipes. The tank gauge makes the refill
 * threshold obvious, so the farmer knows exactly when to start the pump.
 */
export function SystemOverview({ overview }: { overview: SystemOverviewData }) {
  const { pump, tank, standpipes } = overview;

  return (
    <SectionCard
      title="System overview"
      description="Borehole pump, smart tank with ultrasonic sensors, and the three standpipes it feeds."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4">
          <PumpStatusCard pump={pump} />
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Ultrasonic sensors
            </p>
            <p className="mt-1 text-sm font-medium">
              {tank.label}: {tank.level_pct}% · {standpipes.length} standpipes reporting
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <RadioTower className="h-3 w-3 text-success" /> Non-contact probes, every 10 minutes
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-3">
          <TankGauge level={tank} />

          <div className="grid gap-3 sm:grid-cols-3">
            {standpipes.map((pipe) => (
              <TankGauge key={pipe.asset} level={pipe} size="sm" />
            ))}
          </div>

          {tank.needs_refill ? (
            <p className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              Smart tank is at {tank.level_pct}%, under the {tank.refill_threshold_pct}% refill
              threshold. Start the borehole pump to refill.
            </p>
          ) : (
            <p className="flex items-start gap-2 rounded-lg border border-success/30 bg-success/5 px-3 py-2 text-xs text-success">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              Tank is above the {tank.refill_threshold_pct}% threshold. Refill starts
              automatically once it drops below it.
            </p>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
