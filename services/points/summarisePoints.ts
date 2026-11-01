import type { PointSnapshot, PointsSummary } from "@/types/point";

/**
 * Rolls point snapshots into the numbers shown at the top of the dashboard.
 * "Attention" is anything the farmer has to act on: leak, blockage, pressure
 * drop or no flow.
 */
export function summarisePoints(snapshots: PointSnapshot[]): PointsSummary {
  const attentionStatuses = new Set([
    "leak",
    "blockage",
    "pressure_drop",
    "no_flow",
  ]);

  return snapshots.reduce<PointsSummary>(
    (summary, snapshot) => {
      summary.total_points += 1;
      summary.open_alerts += snapshot.open_alerts;
      summary.litres_today += snapshot.litres_today;

      if (attentionStatuses.has(snapshot.status)) summary.attention += 1;
      else if (snapshot.status === "offline") summary.offline += 1;
      else if (snapshot.status === "inactive") summary.inactive += 1;
      else summary.healthy += 1;

      return summary;
    },
    {
      total_points: 0,
      healthy: 0,
      attention: 0,
      offline: 0,
      inactive: 0,
      open_alerts: 0,
      litres_today: 0,
    }
  );
}
