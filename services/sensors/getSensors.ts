import { connectDB } from "@/lib/mongodb";
import { ROLES, type Role } from "@/lib/permissions";
import Point from "@/models/Point";
import Sensor from "@/models/Sensor";
import type { SensorDTO, SensorType } from "@/types/sensor";
import type { TankAsset } from "@/types/tank";

interface SensorLike {
  _id: { toString(): string };
  code: string;
  name: string;
  type: SensorType;
  level_asset?: TankAsset | null;
  unit: string;
  location: string;
  status: "online" | "offline" | "fault";
  battery_pct: number;
  point_id?: { toString(): string } | null;
  last_seen_at: Date | null;
  last_value: number | null;
}

function toSensorDTO(sensor: SensorLike, pointName: string | null): SensorDTO {
  return {
    id: sensor._id.toString(),
    code: sensor.code,
    name: sensor.name,
    type: sensor.type,
    level_asset: sensor.level_asset ?? null,
    unit: sensor.unit,
    location: sensor.location,
    status: sensor.status,
    battery_pct: sensor.battery_pct,
    point_id: sensor.point_id ? sensor.point_id.toString() : null,
    point_name: pointName,
    last_seen_at: sensor.last_seen_at ? sensor.last_seen_at.toISOString() : null,
    latest_value: sensor.last_value ?? null,
  };
}

/** Every sensor on the farm, newest reading first inside each type. */
export async function getSensors(
  userId: string,
  role: Role
): Promise<SensorDTO[]> {
  await connectDB();

  const filter = role === ROLES.ADMIN ? {} : { owner_id: userId };
  const sensors = await Sensor.find(filter).sort({ type: 1, code: 1 });

  const pointIds = Array.from(
    new Set(
      sensors
        .map((sensor) => (sensor.point_id ? sensor.point_id.toString() : null))
        .filter((id): id is string => Boolean(id))
    )
  );

  const points = pointIds.length
    ? await Point.find({ _id: { $in: pointIds } }).select("name")
    : [];
  const names = new Map(points.map((point) => [point._id.toString(), point.name]));

  return sensors.map((sensor) =>
    toSensorDTO(
      sensor,
      sensor.point_id ? names.get(sensor.point_id.toString()) ?? null : null
    )
  );
}
