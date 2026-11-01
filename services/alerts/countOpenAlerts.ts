import { connectDB } from "@/lib/mongodb";
import { ROLES, type Role } from "@/lib/permissions";
import Alert from "@/models/Alert";

export async function countOpenAlerts(userId: string, role: Role): Promise<number> {
  await connectDB();

  const filter: Record<string, unknown> = { status: "open" };
  if (role !== ROLES.ADMIN) filter.owner_id = userId;

  return Alert.countDocuments(filter);
}
