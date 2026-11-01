import { computeVolume } from "@/lib/analytics/volume";
import { computeLoss } from "@/lib/analytics/loss";
import type { PointRange } from "./loadPointRanges";
import type { LossEstimate } from "@/types/report";

/** Litres metered per point across the reporting window. */
export function computePointUsage(ranges: PointRange[]): Map<string, number> {
  return new Map(
    ranges.map((range) => [
      range.point.id,
      Math.round(computeVolume(range.readings)),
    ])
  );
}

/** Leak volume plus delivery shortfall, summed across every point. */
export function computeLossEstimate(ranges: PointRange[]): LossEstimate {
  const total = ranges.reduce<LossEstimate>(
    (sum, range) => {
      const loss = computeLoss(range.readings, range.point.expected_flow_rate);
      sum.leak_litres += loss.leak_litres;
      sum.shortfall_litres += loss.shortfall_litres;
      sum.total_litres += loss.total_litres;
      return sum;
    },
    { leak_litres: 0, shortfall_litres: 0, total_litres: 0 }
  );

  return {
    leak_litres: Math.round(total.leak_litres),
    shortfall_litres: Math.round(total.shortfall_litres),
    total_litres: Math.round(total.total_litres),
  };
}
