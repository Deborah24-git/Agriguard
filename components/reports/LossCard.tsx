import { Droplets, Wrench } from "lucide-react";
import { formatLitres } from "@/lib/format";
import type { LossEstimate } from "@/types/report";

/** Explains where the suspected loss number comes from. */
export function LossCard({ loss }: { loss: LossEstimate }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-destructive/25 bg-destructive/5 p-4">
        <p className="text-xs uppercase tracking-wide text-destructive">
          Total suspected loss
        </p>
        <p className="mt-1 text-3xl font-bold">{formatLitres(loss.total_litres)}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Water billed for but not delivered to the crop.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <Droplets className="h-3.5 w-3.5 text-water" /> Leak volume
          </div>
          <p className="mt-1 text-lg font-semibold">{formatLitres(loss.leak_litres)}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Metered while the valve was closed.
          </p>
        </div>

        <div className="rounded-lg border border-border p-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <Wrench className="h-3.5 w-3.5 text-warning" /> Delivery shortfall
          </div>
          <p className="mt-1 text-lg font-semibold">
            {formatLitres(loss.shortfall_litres)}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Flow below the expected rate while irrigating.
          </p>
        </div>
      </div>
    </div>
  );
}
