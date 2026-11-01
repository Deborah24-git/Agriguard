import { connectDB } from "@/lib/mongodb";
import { ROLES, type Role } from "@/lib/permissions";
import Point from "@/models/Point";
import type { PointFormValues } from "@/lib/pointForm";
import { toPointDTO } from "./toPointDTO";
import type { PointDTO } from "@/types/point";

export async function updatePointRecord(
  pointId: string,
  values: PointFormValues,
  userId: string,
  role: Role
): Promise<PointDTO | null> {
  await connectDB();

  const filter: Record<string, unknown> = { _id: pointId };
  if (role !== ROLES.ADMIN) filter.owner_id = userId;

  const point = await Point.findOneAndUpdate(
    filter,
    {
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
    },
    { new: true }
  );

  return point ? toPointDTO(point) : null;
}
