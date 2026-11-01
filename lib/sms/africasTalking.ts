import type { SmsResult } from "@/types/sms";

const PRODUCTION_ENDPOINT = "https://api.africastalking.com/version1/messaging";
const SANDBOX_ENDPOINT =
  "https://api.sandbox.africastalking.com/version1/messaging";

export function normalizeSmsRecipient(to: string): string {
  const compact = to.trim().replace(/[\s().-]/g, "");

  if (/^0\d{9}$/.test(compact)) {
    return `+27${compact.slice(1)}`;
  }
  if (/^27\d{9}$/.test(compact)) {
    return `+${compact}`;
  }
  return compact;
}

export function isSmsConfigured(): boolean {
  return Boolean(process.env.AT_API_KEY?.trim() && process.env.AT_USERNAME?.trim());
}

/**
 * Sends one SMS through Africa's Talking. Never throws: callers get a status
 * they can store, so a missing key or an offline provider cannot break a
 * telemetry write.
 */
export async function sendSms(to: string, message: string): Promise<SmsResult> {
  const username = process.env.AT_USERNAME?.trim();
  const apiKey = process.env.AT_API_KEY?.trim();
  const recipientNumber = normalizeSmsRecipient(to);

  if (!username || !apiKey) {
    return { status: "skipped", error: "Africa's Talking credentials are not configured." };
  }
  if (!recipientNumber) {
    return { status: "skipped", error: "No recipient number configured." };
  }

  const body = new URLSearchParams({
    username,
    to: recipientNumber,
    message,
  });

  const sender = process.env.AT_SENDER_ID?.trim();
  if (sender) body.set("from", sender);

  try {
    const endpoint =
      username.toLowerCase() === "sandbox"
        ? SANDBOX_ENDPOINT
        : PRODUCTION_ENDPOINT;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: body.toString(),
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as {
      SMSMessageData?: {
        Message?: string;
        Recipients?: Array<{ messageId?: string; status?: string }>;
      };
    } | null;

    const recipient = payload?.SMSMessageData?.Recipients?.[0];

    if (!response.ok) {
      const providerMessage = payload?.SMSMessageData?.Message
        ?.replaceAll(apiKey, "[redacted]")
        .slice(0, 240);
      return {
        status: "failed",
        error: providerMessage
          ? `Africa's Talking returned ${response.status}: ${providerMessage}`
          : `Africa's Talking returned ${response.status}.`,
      };
    }
    if (!recipient) {
      return {
        status: "failed",
        error: "Africa's Talking did not return a delivery result.",
      };
    }
    if (recipient.status !== "Success") {
      return {
        status: "failed",
        error: recipient.status || "Africa's Talking did not confirm delivery.",
      };
    }

    return { status: "sent", provider_id: recipient?.messageId };
  } catch (error) {
    return {
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown SMS error.",
    };
  }
}
