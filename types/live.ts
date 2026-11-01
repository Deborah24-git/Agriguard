import type { AlertDTO } from "./alert";
import type { PointSnapshot, PointsSummary } from "./point";
import type { SystemOverview } from "./system";
import type { TankTrendPoint } from "./tank";

/** One payload for the dashboard, refreshed by the live poll. */
export interface LivePayload {
  summary: PointsSummary;
  overview: SystemOverview;
  snapshots: PointSnapshot[];
  tank_trend: TankTrendPoint[];
  alerts: AlertDTO[];
  generated_at: string;
}

export interface SimulationTickResult {
  readings: number;
  levels: number;
  alerts: number;
}
