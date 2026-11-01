import { RadioTower } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatsCard } from "@/components/ui/StatsCard";
import { SensorCard } from "@/components/sensors/SensorCard";
import { SensorLiveRefresh } from "@/components/sensors/SensorLiveRefresh";
import { SystemOverview } from "@/components/system/SystemOverview";
import { requireSessionUser } from "@/lib/session";
import { getSensors } from "@/services/sensors/getSensors";
import { getSystemOverview } from "@/services/system/getSystemOverview";
import { SENSOR_TYPE_LABELS, type SensorType } from "@/types/sensor";

export const metadata = { title: "Sensors" };
export const dynamic = "force-dynamic";

const ORDER: SensorType[] = ["ultrasonic_level", "flow", "leak", "drain_ultrasonic"];

export default async function SensorsPage() {
  const user = await requireSessionUser();
  const [sensors, overview] = await Promise.all([
    getSensors(user.id, user.role),
    getSystemOverview(user.id, user.role),
  ]);

  const online = sensors.filter((sensor) => sensor.status === "online").length;
  const lowBattery = sensors.filter((sensor) => sensor.battery_pct < 25).length;

  return (
    <>
      <PageHeader
        title="Sensors"
        description="Every ultrasonic level probe, water flow sensor, leak pad and drain probe on the farm."
      />

      <div className="space-y-6">
        <SensorLiveRefresh />

        <div className="grid gap-4 sm:grid-cols-3">
          <StatsCard
            title="Sensors online"
            value={`${online} / ${sensors.length}`}
            description="Reporting to the gateway"
            icon={<RadioTower className="h-4 w-4" />}
            tone={online === sensors.length ? "success" : "warning"}
          />
          <StatsCard
            title="Smart tank fill"
            value={`${overview.tank.level_pct}%`}
            description={`Refill under ${overview.tank.refill_threshold_pct}%`}
            tone={overview.tank.needs_refill ? "danger" : "success"}
          />
          <StatsCard
            title="Low battery"
            value={lowBattery}
            description="Sensors under 25%"
            tone={lowBattery > 0 ? "warning" : "success"}
          />
        </div>

        <SystemOverview overview={overview} />

        {ORDER.map((type) => {
          const group = sensors.filter((sensor) => sensor.type === type);
          if (group.length === 0) return null;

          return (
            <SectionCard
              key={type}
              title={SENSOR_TYPE_LABELS[type]}
              description={`${group.length} ${group.length === 1 ? "unit" : "units"} installed`}
            >
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {group.map((sensor) => (
                  <SensorCard key={sensor.id} sensor={sensor} />
                ))}
              </div>
            </SectionCard>
          );
        })}
      </div>
    </>
  );
}
