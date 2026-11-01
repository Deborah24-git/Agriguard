export interface DailyUsage {
  /** ISO date, "YYYY-MM-DD". */
  date: string;
  litres: number;
  lost_litres: number;
  irrigation_minutes: number;
}

export interface IrrigationSession {
  started_at: string;
  ended_at: string;
  minutes: number;
  litres: number;
}

/** An irrigation run tagged with the point it belongs to. */
export interface NamedSession extends IrrigationSession {
  point_id: string;
  point_name: string;
}

export interface LossEstimate {
  leak_litres: number;
  shortfall_litres: number;
  total_litres: number;
}

export interface UsageTotals {
  litres: number;
  lost_litres: number;
  irrigation_minutes: number;
  sessions: number;
}
