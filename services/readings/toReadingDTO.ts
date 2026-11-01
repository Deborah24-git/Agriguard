import type { ReadingDTO, ReadingPoint } from "@/types/reading";

interface ReadingLike {
  _id: { toString(): string };
  point_id: { toString(): string };
  flow_rate: number;
  pressure: number;
  valve_state: "open" | "closed";
  source: "sensor" | "simulator" | "manual";
  recorded_at: Date;
}

/** Minimal shape used by the detection and reporting math. */
export function toReadingPoint(reading: ReadingLike): ReadingPoint {
  return {
    flow_rate: reading.flow_rate,
    pressure: reading.pressure,
    valve_state: reading.valve_state,
    recorded_at: reading.recorded_at,
  };
}

export function toReadingDTO(reading: ReadingLike): ReadingDTO {
  return {
    id: reading._id.toString(),
    point_id: reading.point_id.toString(),
    flow_rate: reading.flow_rate,
    pressure: reading.pressure,
    valve_state: reading.valve_state,
    recorded_at: reading.recorded_at.toISOString(),
    source: reading.source,
  };
}
