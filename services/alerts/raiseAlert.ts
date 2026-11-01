import { connectDB } from "@/lib/mongodb";
import Alert from "@/models/Alert";
import type { AlertCandidate } from "@/types/alert";
import type { SmsStatus } from "@/types/sms";
import { notifyAlertSms } from "@/services/notifications/notifyAlertSms";
import { DETECTION } from "@/lib/detection/config";

interface RaiseInput {
  ownerId: string;
  pointId: string;
  sensorId?: string | null;
  candidate: AlertCandidate;
  simulated?: boolean;
}

export interface RaiseAlertResult {
  created: boolean;
  smsStatus: SmsStatus | null;
}

/**
 * Persists a finding, suppressing repeats of the same type inside the cooldown
 * window, then hands it to Africa's Talking. Reports whether an alert was
 * created and the resulting SMS status.
 */
export async function raiseAlert({
  ownerId,
  pointId,
  sensorId = null,
  candidate,
  simulated = false,
}: RaiseInput): Promise<RaiseAlertResult> {
  await connectDB();

  const cooldownStart = new Date(
    Date.now() - DETECTION.alertCooldownMinutes * 60_000
  );

  const duplicate = await Alert.exists({
    point_id: pointId,
    type: candidate.type,
    status: { $ne: "resolved" },
    detected_at: { $gte: cooldownStart },
  });
  if (duplicate) return { created: false, smsStatus: null };

  const alert = await Alert.create({
    owner_id: ownerId,
    point_id: pointId,
    sensor_id: sensorId,
    type: candidate.type,
    severity: candidate.severity,
    title: candidate.title,
    message: candidate.message,
    status: "open",
    flow_rate: candidate.metrics.flow_rate,
    pressure: candidate.metrics.pressure,
    detected_at: new Date(),
  });

  let smsStatus: SmsStatus = "failed";
  try {
    smsStatus = await notifyAlertSms(
      alert._id.toString(),
      ownerId,
      candidate.title,
      candidate.message,
      simulated
    );
  } catch (error) {
    console.error(`Failed to record SMS notification for alert ${alert._id}.`, error);
  }

  return { created: true, smsStatus };
}
