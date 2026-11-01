import type { AlertDTO } from "@/types/alert";

interface AlertLike {
  _id: { toString(): string };
  point_id?: { toString(): string } | null;
  sensor_id?: { toString(): string } | null;
  type: AlertDTO["type"];
  severity: AlertDTO["severity"];
  title: string;
  message: string;
  status: AlertDTO["status"];
  flow_rate: number;
  pressure: number;
  detected_at: Date;
  acknowledged_at: Date | null;
  resolved_at: Date | null;
  sms_status?: AlertDTO["sms_status"];
}

export function toAlertDTO(alert: AlertLike, pointName: string): AlertDTO {
  return {
    id: alert._id.toString(),
    point_id: alert.point_id ? alert.point_id.toString() : null,
    point_name: pointName,
    sensor_id: alert.sensor_id ? alert.sensor_id.toString() : null,
    type: alert.type,
    severity: alert.severity,
    title: alert.title,
    message: alert.message,
    status: alert.status,
    flow_rate: alert.flow_rate,
    pressure: alert.pressure,
    detected_at: alert.detected_at.toISOString(),
    acknowledged_at: alert.acknowledged_at ? alert.acknowledged_at.toISOString() : null,
    resolved_at: alert.resolved_at ? alert.resolved_at.toISOString() : null,
    sms_status: alert.sms_status ?? null,
  };
}
