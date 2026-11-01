export type SmsStatus = "sent" | "failed" | "skipped";

export interface SmsResult {
  status: SmsStatus;
  provider_id?: string;
  error?: string;
}

export interface SandboxSmsTestResult extends SmsResult {
  recipient: string | null;
  sender_id: string | null;
}

export interface SmsLogDTO {
  id: string;
  sender_id: string | null;
  to: string;
  message: string;
  status: SmsStatus;
  is_simulation: boolean;
  is_sandbox_test: boolean;
  provider_id: string | null;
  error: string | null;
  created_at: string;
}
