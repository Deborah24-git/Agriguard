import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import type { Role } from "@/lib/permissions";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  farm_name: string;
  phone: string;
}

export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  if (!isValidObjectId(userId)) return null;

  await connectDB();
  const user = await User.findById(userId).select("name email role farm_name phone");
  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role as Role,
    farm_name: user.farm_name,
    phone: user.phone ?? "",
  };
}
