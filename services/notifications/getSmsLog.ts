import { connectDB } from "@/lib/mongodb";
import SmsLog from "@/models/SmsLog";
import type { SmsLogDTO } from "@/types/sms";

const SIMULATION_PREFIX = "[SIMULATED] ";
const SANDBOX_TEST_PREFIX = "[SANDBOX TEST] ";

export async function getSmsLog(limit = 20): Promise<SmsLogDTO[]> {
  await connectDB();

  const logs = await SmsLog.find({}).sort({ created_at: -1 }).limit(limit);

  return logs.map((log) => {
    const isSimulation = log.message.startsWith(SIMULATION_PREFIX);
    const isSandboxTest = log.message.startsWith(SANDBOX_TEST_PREFIX);
    const prefix = isSimulation
      ? SIMULATION_PREFIX
      : isSandboxTest
        ? SANDBOX_TEST_PREFIX
        : "";

    return {
      id: log._id.toString(),
      sender_id: log.sender_id ?? null,
      to: log.to,
      message: prefix ? log.message.slice(prefix.length) : log.message,
      status: log.status,
      is_simulation: isSimulation,
      is_sandbox_test: isSandboxTest,
      provider_id: log.provider_id ?? null,
      error: log.error ?? null,
      created_at: log.created_at.toISOString(),
    };
  });
}
