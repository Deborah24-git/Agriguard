import type { DailyUsage, UsageTotals } from "@/types/report";

export function computeUsageTotals(
  daily: DailyUsage[],
  sessionCount: number
): UsageTotals {
  return {
    litres: daily.reduce((total, day) => total + day.litres, 0),
    lost_litres: daily.reduce((total, day) => total + day.lost_litres, 0),
    irrigation_minutes: daily.reduce(
      (total, day) => total + day.irrigation_minutes,
      0
    ),
    sessions: sessionCount,
  };
}
