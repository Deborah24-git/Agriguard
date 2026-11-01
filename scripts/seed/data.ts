import type { IrrigationSchedule } from "@/types/point";
import type { SimulatedFault } from "@/lib/simulator/sample";

export interface PointSeed {
  name: string;
  code: string;
  crop_type: string;
  area_hectares: number;
  expected_flow_rate: number;
  min_pressure: number;
  max_pressure: number;
  fault: SimulatedFault;
  /** Hours from seed time when this point's valve opens. */
  offset_hours: number;
}

/** Points A-E. Point B opens later, so its built-in leak shows up while shut. */
export const POINT_SEEDS: PointSeed[] = [
  {
    name: "Point A",
    code: "PT-A",
    crop_type: "Tomatoes",
    area_hectares: 2.4,
    expected_flow_rate: 42,
    min_pressure: 140,
    max_pressure: 220,
    fault: "none",
    offset_hours: -2,
  },
  {
    name: "Point B",
    code: "PT-B",
    crop_type: "Maize",
    area_hectares: 3.1,
    expected_flow_rate: 55,
    min_pressure: 150,
    max_pressure: 240,
    fault: "leak",
    offset_hours: 2,
  },
  {
    name: "Point C",
    code: "PT-C",
    crop_type: "Spinach",
    area_hectares: 1.6,
    expected_flow_rate: 32,
    min_pressure: 120,
    max_pressure: 200,
    fault: "blockage",
    offset_hours: -1,
  },
  {
    name: "Point D",
    code: "PT-D",
    crop_type: "Butternut",
    area_hectares: 2,
    expected_flow_rate: 38,
    min_pressure: 130,
    max_pressure: 210,
    fault: "pressure_drop",
    offset_hours: -3,
  },
  {
    name: "Point E",
    code: "PT-E",
    crop_type: "Onions",
    area_hectares: 1.2,
    expected_flow_rate: 26,
    min_pressure: 110,
    max_pressure: 190,
    fault: "no_flow",
    offset_hours: -1.5,
  },
];

const pad = (value: number) => String(value).padStart(2, "0");

/** A 5-hour window that starts `offsetHours` from seed time. */
export function buildSchedule(offsetHours: number, now: Date): IrrigationSchedule {
  const start = new Date(now.getTime() + offsetHours * 3_600_000);
  const minutes = Math.floor(start.getMinutes() / 10) * 10;

  return {
    start_time: `${pad(start.getHours())}:${pad(minutes)}`,
    duration_minutes: 300,
    active_days: [0, 1, 2, 3, 4, 5, 6],
  };
}

export interface FlowSensorSeed {
  pointCode: string;
  code: string;
  name: string;
  location: string;
  battery_pct: number;
}

export const FLOW_SENSORS: FlowSensorSeed[] = [
  { pointCode: "PT-A", code: "SENS-FLOW-A", name: "Point A flow meter", location: "Point A valve", battery_pct: 96 },
  { pointCode: "PT-B", code: "SENS-FLOW-B", name: "Point B flow meter", location: "Point B valve", battery_pct: 88 },
  { pointCode: "PT-C", code: "SENS-FLOW-C", name: "Point C flow meter", location: "Point C valve", battery_pct: 74 },
  { pointCode: "PT-D", code: "SENS-FLOW-D", name: "Point D flow meter", location: "Point D valve", battery_pct: 63 },
  { pointCode: "PT-E", code: "SENS-FLOW-E", name: "Point E flow meter", location: "Point E valve", battery_pct: 41 },
];
