import { connectDB } from "@/lib/mongodb";
import { ROLES, type Role } from "@/lib/permissions";
import Alert from "@/models/Alert";
import Point from "@/models/Point";
import Reading from "@/models/Reading";
import Sensor from "@/models/Sensor";

/**
 * Removes a point and everything attached to it, so no orphan readings or
 * alerts survive in the reports.
 */
export async function deletePointRecord(
  pointId: string,
  userId: string,
  role: Role
): Promise<boolean> {
  await connectDB();

  const filter: Record<string, unknown> = { _id: pointId };
  if (role !== ROLES.ADMIN) filter.owner_id = userId;

  const point = await Point.findOneAndDelete(filter);
  if (!point) return false;

  await Promise.all([
    Reading.deleteMany({ point_id: pointId }),
    Alert.deleteMany({ point_id: pointId }),
    Sensor.updateMany({ point_id: pointId }, { point_id: null }),
  ]);

  return true;
}
