export type ValveState = "open" | "closed";
export type ReadingSource = "sensor" | "simulator" | "manual";

export interface ReadingDTO {
  id: string;
  point_id: string;
  flow_rate: number;
  pressure: number;
  valve_state: ValveState;
  recorded_at: string;
  source: ReadingSource;
}

/** Minimal shape used by the detection and reporting math. */
export interface ReadingPoint {
  flow_rate: number;
  pressure: number;
  valve_state: ValveState;
  recorded_at: Date;
}
