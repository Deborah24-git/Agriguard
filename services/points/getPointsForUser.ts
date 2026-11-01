import { connectDB } from "@/lib/mongodb";
import { ROLES, type Role } from "@/lib/permissions";
import Point from "@/models/Point";
import { toPointDTO } from "./toPointDTO";
import type { PointDTO } from "@/types/point";

/** Admins see the whole network; farmers only their own points. */
export async function getPointsForUser(
  userId: string,
  role: Role
): Promise<PointDTO[]> {
  await connectDB();

  const filter = role === ROLES.ADMIN ? {} : { owner_id: userId };
  const points = await Point.find(filter).sort({ code: 1 });

  return points.map(toPointDTO);
}
