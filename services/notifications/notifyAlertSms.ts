import { connectDB } from "@/lib/mongodb";
import {
  normalizeSmsRecipient,
  sendSms,
} from "@/lib/sms/africasTalking";
import Alert from "@/models/Alert";
import SmsLog from "@/models/SmsLog";
import User from "@/models/User";
import type { SmsStatus } from "@/types/sms";

/**
 * Delivers an alert by SMS through Africa's Talking, then records the outcome
 * against the alert so the UI can show whether the farmer was actually told.
 */
export async function notifyAlertSms(
  alertId: string,
  ownerId: string,
  title: string,
  message: string,
  simulated = false
): Promise<SmsStatus> {
  await connectDB();

  const owner = await User.findById(ownerId).select("phone name");
  const recipient = normalizeSmsRecipient(
    process.env.AT_SMS_TO?.trim() || owner?.phone?.trim() || ""
  );
  const body = `AgriGuard${simulated ? " SIMULATION" : ""}: ${title}. ${message}`.slice(
    0,
    320
  );

  const result = await sendSms(recipient, body);

  await SmsLog.create({
    alert_id: alertId,
    sender_id: process.env.AT_SENDER_ID?.trim() || null,
    to: recipient || "unconfigured",
    message: simulated ? `[SIMULATED] ${body}` : body,
    status: result.status,
    provider_id: result.provider_id ?? null,
    error: result.error ?? null,
  });

  await Alert.findByIdAndUpdate(alertId, { sms_status: result.status });

  return result.status;
}
