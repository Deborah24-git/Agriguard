import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { ROLES, type Role } from "@/lib/permissions";
import Point from "@/models/Point";
import { toPointDTO } from "./toPointDTO";
import type { PointDTO } from "@/types/point";

export async function getPointForUser(
  pointId: string,
  userId: string,
  role: Role
): Promise<PointDTO | null> {
  if (!isValidObjectId(pointId)) return null;

  await connectDB();

  const filter: Record<string, unknown> = { _id: pointId };
  if (role !== ROLES.ADMIN) filter.owner_id = userId;

  const point = await Point.findOne(filter);
  return point ? toPointDTO(point) : null;
}
