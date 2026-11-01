import type { SmsStatus } from "./sms";

export type AlertType =
  | "leak"
  | "blockage"
  | "pressure_drop"
  | "no_flow"
  | "low_tank";
export type AlertSeverity = "critical" | "warning" | "info";
export type AlertStatus = "open" | "acknowledged" | "resolved";

export type AlertStatusCounts = Record<AlertStatus, number>;

export interface AlertCandidate {
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  /** The reading values that triggered the rule, kept for the audit trail. */
  metrics: {
    flow_rate: number;
    pressure: number;
    valve_state: "open" | "closed";
    expected_flow_rate: number;
  };
}

export interface AlertDTO {
  id: string;
  point_id: string | null;
  point_name: string;
  sensor_id: string | null;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  status: AlertStatus;
  flow_rate: number;
  pressure: number;
  detected_at: string;
  acknowledged_at: string | null;
  resolved_at: string | null;
  /** Result of the Africa's Talking notification, when one was attempted. */
  sms_status: SmsStatus | null;
}

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  leak: "Suspected leak",
  blockage: "Possible blockage",
  pressure_drop: "Pressure drop",
  no_flow: "No water flow",
  low_tank: "Low tank level",
};
