import { connectDB } from "@/lib/mongodb";
import Alert from "@/models/Alert";
import { toAlertDTO } from "./toAlertDTO";
import type { AlertDTO } from "@/types/alert";

export async function getPointAlerts(
  pointId: string,
  pointName: string,
  limit = 6
): Promise<AlertDTO[]> {
  await connectDB();

  const alerts = await Alert.find({ point_id: pointId })
    .sort({ detected_at: -1 })
    .limit(limit);

  return alerts.map((alert) => toAlertDTO(alert, pointName));
}
