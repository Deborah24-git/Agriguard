import type { PointDTO } from "@/types/point";

interface PointLike {
  _id: { toString(): string };
  name: string;
  code: string;
  crop_type: string;
  area_hectares: number;
  expected_flow_rate: number;
  min_pressure: number;
  max_pressure: number;
  schedule: {
    start_time: string;
    duration_minutes: number;
    active_days: number[];
  };
  is_active: boolean;
  owner_id: { toString(): string };
  created_at: Date;
}

export function toPointDTO(point: PointLike): PointDTO {
  return {
    id: point._id.toString(),
    name: point.name,
    code: point.code,
    crop_type: point.crop_type,
    area_hectares: point.area_hectares,
    expected_flow_rate: point.expected_flow_rate,
    min_pressure: point.min_pressure,
    max_pressure: point.max_pressure,
    schedule: {
      start_time: point.schedule.start_time,
      duration_minutes: point.schedule.duration_minutes,
      active_days: [...point.schedule.active_days],
    },
    is_active: point.is_active,
    owner_id: point.owner_id.toString(),
    created_at: point.created_at.toISOString(),
  };
}
