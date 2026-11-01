import { connectDB } from "@/lib/mongodb";
import LevelReading from "@/models/LevelReading";
import {
  REFILL_THRESHOLD_PCT,
  TANK_ASSET_CAPACITY,
  TANK_ASSET_LABELS,
  type TankAsset,
  type TankLevelDTO,
} from "@/types/tank";

export const TANK_ASSETS: TankAsset[] = [
  "tank",
  "standpipe_1",
  "standpipe_2",
  "standpipe_3",
];

interface LevelDoc {
  level_pct: number;
  recorded_at: Date;
}

/** Latest percentage per asset, in one pass. */
export async function getTankLevels(): Promise<TankLevelDTO[]> {
  await connectDB();

  const rows = await LevelReading.aggregate<{ _id: TankAsset; doc: LevelDoc }>([
    { $sort: { recorded_at: -1 } },
    { $group: { _id: "$asset", doc: { $first: "$$ROOT" } } },
  ]);

  const latest = new Map(rows.map((row) => [row._id, row.doc]));

  return TANK_ASSETS.map((asset) => {
    const reading = latest.get(asset);
    const level = reading?.level_pct ?? 0;

    return {
      asset,
      label: TANK_ASSET_LABELS[asset],
      level_pct: Math.round(level),
      capacity_litres: TANK_ASSET_CAPACITY[asset],
      refill_threshold_pct: REFILL_THRESHOLD_PCT,
      needs_refill: asset === "tank" && level < REFILL_THRESHOLD_PCT,
      last_reading_at: reading ? reading.recorded_at.toISOString() : null,
    };
  });
}

/** Level history for the trend chart, oldest first. */
export async function getLevelTrend(
  asset: TankAsset,
  hoursBack = 72
): Promise<Array<{ recorded_at: string; level_pct: number }>> {
  await connectDB();

  const from = new Date(Date.now() - hoursBack * 60 * 60_000);
  const readings = await LevelReading.find({
    asset,
    recorded_at: { $gte: from },
  }).sort({ recorded_at: 1 });

  return readings.map((reading) => ({
    recorded_at: reading.recorded_at.toISOString(),
    level_pct: Math.round(reading.level_pct),
  }));
}

export async function getLevelReadingCount(asset: TankAsset): Promise<number> {
  await connectDB();
  return LevelReading.countDocuments({ asset });
}
