import { connectDB } from "@/lib/mongodb";
import {
  normalizeSmsRecipient,
} from "@/lib/sms/africasTalking";
import Point from "@/models/Point";
import User from "@/models/User";
import { recordReading } from "@/services/readings/recordReading";
import type { SandboxSmsTestResult } from "@/types/sms";

export async function sendSandboxTestSms(
  ownerId: string
): Promise<SandboxSmsTestResult> {
  const username = process.env.AT_USERNAME?.trim();
  const senderId = process.env.AT_SENDER_ID?.trim() || null;

  if (username?.toLowerCase() !== "sandbox") {
    return {
      status: "skipped",
      recipient: null,
      sender_id: senderId,
      error: "Test sending is restricted to AT_USERNAME=sandbox.",
    };
  }

  await connectDB();
  const owner = await User.findById(ownerId).select("phone");
  const point = await Point.findOne({ owner_id: ownerId, is_active: true })
    .sort({ code: 1 })
    .select("name expected_flow_rate min_pressure max_pressure");
  if (!point) {
    return {
      status: "skipped",
      recipient: null,
      sender_id: senderId,
      error: "No active point is available for the simulated leak.",
    };
  }

  const recipient = normalizeSmsRecipient(
    process.env.AT_SMS_TO?.trim() || owner?.phone?.trim() || ""
  );
  const reading = {
    flowRate: Math.max(point.expected_flow_rate * 0.3, 0.6),
    pressure: (point.min_pressure + point.max_pressure) / 2,
    valveState: "closed" as const,
    source: "simulator" as const,
  };
  const result = await recordReading({
    pointId: point._id.toString(),
    ...reading,
  });

  if (!result.alertRaised) {
    return {
      status: "skipped",
      recipient: recipient || null,
      sender_id: senderId,
      error:
        "Leak telemetry was recorded, but a matching alert is already active during the cooldown period. Resolve the existing leak alert before testing again.",
    };
  }

  return {
    status: result.smsStatus ?? "failed",
    error:
      result.smsStatus === "failed"
        ? "The simulated leak alert was created, but the SMS provider did not accept the message. Check the SMS activity log for details."
        : undefined,
    recipient: recipient || null,
    sender_id: senderId,
  };
}
