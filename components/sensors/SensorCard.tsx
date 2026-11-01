import {
  BatteryMedium,
  Droplets,
  RadioTower,
  ShieldAlert,
  Waves,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatRelative } from "@/lib/format";
import {
  SENSOR_TYPE_DESCRIPTIONS,
  SENSOR_TYPE_LABELS,
  type SensorDTO,
  type SensorType,
} from "@/types/sensor";

const ICONS: Record<SensorType, typeof Droplets> = {
  ultrasonic_level: Waves,
  flow: Droplets,
  leak: ShieldAlert,
  drain_ultrasonic: RadioTower,
};

const STATUS_VARIANT = {
  online: "success",
  offline: "muted",
  fault: "danger",
} as const;

export function SensorCard({ sensor }: { sensor: SensorDTO }) {
  const Icon = ICONS[sensor.type];

  return (
    <article className="glass-card rounded-xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold">{sensor.name}</p>
            <p className="font-mono text-[11px] uppercase text-muted-foreground">
              {sensor.code}
            </p>
          </div>
        </div>
        <Badge variant={STATUS_VARIANT[sensor.status]}>{sensor.status}</Badge>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {SENSOR_TYPE_DESCRIPTIONS[sensor.type]}
      </p>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-muted/50 px-2.5 py-2">
          <dt className="text-[10px] uppercase text-muted-foreground">Type</dt>
          <dd className="font-semibold">{SENSOR_TYPE_LABELS[sensor.type]}</dd>
        </div>
        <div className="rounded-lg bg-muted/50 px-2.5 py-2">
          <dt className="text-[10px] uppercase text-muted-foreground">Location</dt>
          <dd className="truncate font-semibold">
            {sensor.point_name ?? sensor.location}
          </dd>
        </div>
        <div className="rounded-lg bg-muted/50 px-2.5 py-2">
          <dt className="text-[10px] uppercase text-muted-foreground">Last value</dt>
          <dd className="font-semibold">
            {sensor.latest_value === null
              ? "—"
              : `${sensor.latest_value} ${sensor.unit}`}
          </dd>
        </div>
        <div className="rounded-lg bg-muted/50 px-2.5 py-2">
          <dt className="inline-flex items-center gap-1 text-[10px] uppercase text-muted-foreground">
            <BatteryMedium className="h-3 w-3" /> Battery
          </dt>
          <dd className="font-semibold">{sensor.battery_pct}%</dd>
        </div>
      </dl>

      <p className="mt-2 text-[11px] text-muted-foreground">
        {sensor.last_seen_at
          ? `Last seen ${formatRelative(sensor.last_seen_at)}`
          : "No reading received yet"}
      </p>
    </article>
  );
}
