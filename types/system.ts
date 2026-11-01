import type { PointSnapshot } from "./point";
import type { TankLevelDTO } from "./tank";

export type PumpState = "running" | "idle" | "fault";

export interface PumpStatus {
  state: PumpState;
  pressure_kpa: number;
  flow_rate: number;
  runtime_minutes_today: number;
  last_updated_at: string | null;
}

/** Everything the system overview panel needs, in one payload. */
export interface SystemOverview {
  pump: PumpStatus;
  tank: TankLevelDTO;
  standpipes: TankLevelDTO[];
  points: PointSnapshot[];
  open_alerts: number;
  litres_today: number;
}
