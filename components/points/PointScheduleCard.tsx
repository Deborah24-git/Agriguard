import { CalendarDays, Gauge, Ruler, Waves } from "lucide-react";
import type { PointDTO } from "@/types/point";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_INITIALS = ["S", "M", "T", "W", "T", "F", "S"];

export function PointScheduleCard({ point }: { point: PointDTO }) {
  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-start gap-3">
        <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div>
          <p className="font-medium">Irrigation window</p>
          <p className="text-muted-foreground">
            Starts {point.schedule.start_time}, runs {point.schedule.duration_minutes} minutes
          </p>
          <div className="mt-2 flex gap-1">
            {DAY_INITIALS.map((initial, index) => (
              <span
                key={`${initial}-${index}`}
                title={DAY_NAMES[index]}
                className={
                  point.schedule.active_days.includes(index)
                    ? "flex h-6 w-6 items-center justify-center rounded bg-primary text-[11px] font-bold text-primary-foreground"
                    : "flex h-6 w-6 items-center justify-center rounded bg-muted text-[11px] text-muted-foreground"
                }
              >
                {initial}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Waves className="mt-0.5 h-4 w-4 shrink-0 text-water" />
        <div>
          <p className="font-medium">Expected flow</p>
          <p className="text-muted-foreground">{point.expected_flow_rate} L/min when running clean</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div>
          <p className="font-medium">Pressure band</p>
          <p className="text-muted-foreground">
            {point.min_pressure}-{point.max_pressure} kPa
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Ruler className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div>
          <p className="font-medium">Coverage</p>
          <p className="text-muted-foreground">
            {point.area_hectares} ha of {point.crop_type.toLowerCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
