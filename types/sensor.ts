import type { TankAsset } from "./tank";

export type SensorType = "ultrasonic_level" | "flow" | "leak" | "drain_ultrasonic";
export type SensorStatus = "online" | "offline" | "fault";

export interface SensorDTO {
  id: string;
  code: string;
  name: string;
  type: SensorType;
  level_asset: TankAsset | null;
  unit: string;
  location: string;
  status: SensorStatus;
  battery_pct: number;
  point_id: string | null;
  point_name: string | null;
  last_seen_at: string | null;
  latest_value: number | null;
}

export const SENSOR_TYPE_LABELS: Record<SensorType, string> = {
  ultrasonic_level: "Ultrasonic level",
  flow: "Water flow",
  leak: "Leak detection",
  drain_ultrasonic: "Ultrasonic drain",
};

export const SENSOR_TYPE_DESCRIPTIONS: Record<SensorType, string> = {
  ultrasonic_level:
    "Non-contact ultrasonic probe that measures the water surface and reports tank fill as a percentage.",
  flow: "Inline water sensor that counts litres and confirms every point is receiving the flow it should.",
  leak: "Conductivity pad on the main line that detects water where there should be none.",
  drain_ultrasonic:
    "Ultrasonic probe in the drain sump that measures runoff and flags water escaping the system.",
};
