export type TankAsset = "tank" | "standpipe_1" | "standpipe_2" | "standpipe_3";

export interface LevelReadingDTO {
  asset: TankAsset;
  level_pct: number;
  recorded_at: string;
}

export interface TankLevelDTO {
  asset: TankAsset;
  label: string;
  level_pct: number;
  capacity_litres: number;
  /** Below this the pump refill cycle starts. */
  refill_threshold_pct: number;
  needs_refill: boolean;
  last_reading_at: string | null;
}

export interface TankTrendPoint {
  recorded_at: string;
  level_pct: number;
}

export const TANK_ASSET_LABELS: Record<TankAsset, string> = {
  tank: "Smart tank",
  standpipe_1: "Standpipe 1",
  standpipe_2: "Standpipe 2",
  standpipe_3: "Standpipe 3",
};

export const TANK_ASSET_CAPACITY: Record<TankAsset, number> = {
  tank: 25_000,
  standpipe_1: 4_000,
  standpipe_2: 3_500,
  standpipe_3: 3_000,
};

export const REFILL_THRESHOLD_PCT = 25;
