import { connectDB } from "@/lib/mongodb";
import Point from "@/models/Point";
import type { PointFormValues } from "@/lib/pointForm";
import { toPointDTO } from "./toPointDTO";
import type { PointDTO } from "@/types/point";

export async function createPointRecord(
  values: PointFormValues,
  ownerId: string
): Promise<PointDTO> {
  await connectDB();

  const point = await Point.create({
    name: values.name,
    code: values.code,
    crop_type: values.crop_type,
    area_hectares: values.area_hectares,
    expected_flow_rate: values.expected_flow_rate,
    min_pressure: values.min_pressure,
    max_pressure: values.max_pressure,
    schedule: {
      start_time: values.start_time,
      duration_minutes: values.duration_minutes,
      active_days: values.active_days,
    },
    is_active: true,
    owner_id: ownerId,
  });

  return toPointDTO(point);
}
