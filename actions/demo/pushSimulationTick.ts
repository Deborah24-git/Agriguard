"use server";

import { revalidatePath } from "next/cache";
import { hasPermission } from "@/lib/permissions";
import { requireSessionUser } from "@/lib/session";
import { runSimulationTick } from "@/services/simulator/runSimulationTick";
import type { SimulationTickResult } from "@/types/live";

/** Writes one fresh sensor sample for the signed-in farmer's points. */
export async function pushSimulationTick(): Promise<SimulationTickResult> {
  const user = await requireSessionUser();
  if (!hasPermission(user.role, "demo:simulate")) throw new Error("Forbidden");

  const result = await runSimulationTick(user.role === "admin" ? undefined : user.id);

  revalidatePath("/dashboard");
  revalidatePath("/points");
  revalidatePath("/sensors");
  revalidatePath("/alerts");

  return result;
}
