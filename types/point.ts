export type PointStatus =
  | "normal"
  | "irrigating"
  | "idle"
  | "leak"
  | "blockage"
  | "pressure_drop"
  | "no_flow"
  | "offline"
  | "inactive";

export interface IrrigationSchedule {
  /** 24h "HH:mm" clock time the valve is switched on. */
  start_time: string;
  /** How long the valve stays open, in minutes. */
  duration_minutes: number;
  /** Days of the week: 0 = Sunday ... 6 = Saturday. */
  active_days: number[];
}

export interface PointDTO {
  id: string;
  name: string;
  code: string;
  crop_type: string;
  area_hectares: number;
  expected_flow_rate: number;
  min_pressure: number;
  max_pressure: number;
  schedule: IrrigationSchedule;
  is_active: boolean;
  owner_id: string;
  created_at: string;
}

/** The fields the detection rules need — no Mongoose types leak in. */
export interface DetectionPoint {
  name: string;
  expected_flow_rate: number;
  min_pressure: number;
  max_pressure: number;
}

export interface PointSnapshot {
  point: PointDTO;
  status: PointStatus;
  flow_rate: number | null;
  pressure: number | null;
  valve_state: "open" | "closed" | null;
  last_reading_at: string | null;
  litres_today: number;
  open_alerts: number;
}

/** Rolled-up numbers shown at the top of the dashboard. */
export interface PointsSummary {
  total_points: number;
  healthy: number;
  attention: number;
  offline: number;
  inactive: number;
  open_alerts: number;
  litres_today: number;
}
