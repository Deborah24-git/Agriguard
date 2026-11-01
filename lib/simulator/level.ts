import { REFILL_THRESHOLD_PCT, type TankAsset } from "@/types/tank";

/** Per-hour drain used by the demo level simulator. */
const DRAIN_PER_HOUR: Record<TankAsset, number> = {
  tank: 0.42,
  standpipe_1: 0.68,
  standpipe_2: 0.6,
  standpipe_3: 0.52,
};

const REFILL_PER_HOUR = 3.2;
const REFILL_STOP_PCT = 88;

/**
 * Next percentage for an ultrasonic probe. The smart tank refills itself from
 * the borehole once it falls under the refill threshold, which is exactly the
 * cycle the overview panel is meant to show.
 */
export function nextLevel(
  asset: TankAsset,
  currentPct: number,
  hoursElapsed: number,
  at: Date
): number {
  const hours = Math.max(0, Math.min(6, hoursElapsed));
  const wobble = Math.sin(at.getTime() / 3_600_000 + asset.length) * 0.15;

  if (asset === "tank" && currentPct < REFILL_THRESHOLD_PCT) {
    return clamp(currentPct + REFILL_PER_HOUR * hours + wobble);
  }
  if (asset === "tank" && currentPct > REFILL_STOP_PCT) {
    return clamp(currentPct - DRAIN_PER_HOUR.tank * hours + wobble);
  }

  return clamp(currentPct - DRAIN_PER_HOUR[asset] * hours + wobble);
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}
