import { computeVolume, volumeBetween } from "@/lib/analytics/volume";
import type { ReadingPoint } from "@/types/reading";
import type { IrrigationSession } from "@/types/report";

/** A valve that stays open with no sample for this long ends the session. */
const MAX_SESSION_GAP_MINUTES = 30;

/**
 * Turns one point's chronological readings into completed irrigation runs.
 * A run starts at the first open sample and closes on the first shut sample
 * (or a sensor gap), so partial runs at the edge of the window are dropped.
 */
export function detectSessions(readings: ReadingPoint[]): IrrigationSession[] {
  const sessions: IrrigationSession[] = [];
  let run: ReadingPoint[] = [];

  function closeRun() {
    if (run.length < 2) {
      run = [];
      return;
    }

    const first = run[0];
    const last = run[run.length - 1];
    sessions.push({
      started_at: first.recorded_at.toISOString(),
      ended_at: last.recorded_at.toISOString(),
      minutes: Math.round((last.recorded_at.getTime() - first.recorded_at.getTime()) / 60_000),
      litres: Math.round(computeVolume(run)),
    });
    run = [];
  }

  for (const reading of readings) {
    if (reading.valve_state === "open") {
      const previous = run[run.length - 1];
      if (previous) {
        const gap = (reading.recorded_at.getTime() - previous.recorded_at.getTime()) / 60_000;
        if (gap > MAX_SESSION_GAP_MINUTES) closeRun();
      }
      run.push(reading);
    } else if (run.length > 0) {
      run.push(reading);
      closeRun();
    }
  }

  return sessions;
}

/** Volume between the first and last sample of a single day bucket. */
export function dayVolume(readings: ReadingPoint[]): number {
  return computeVolume(readings);
}

export { volumeBetween };
