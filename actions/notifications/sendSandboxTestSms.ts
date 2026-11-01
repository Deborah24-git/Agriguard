"use server";

import { revalidatePath } from "next/cache";
import { requireSessionUser } from "@/lib/session";
import { sendSandboxTestSms as sendTest } from "@/services/notifications/sendSandboxTestSms";
import type { SandboxSmsTestResult } from "@/types/sms";

export async function sendSandboxTestSms(): Promise<SandboxSmsTestResult> {
  const user = await requireSessionUser();
  const result = await sendTest(user.id);
  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/alerts");
  revalidatePath("/points");
  revalidatePath("/sensors");
  return result;
}
