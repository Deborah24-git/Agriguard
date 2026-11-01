import type { IrrigationSchedule } from "@/types/point";

const DAY_MINUTES = 24 * 60;

function toMinutes(clock: string): number {
  const [hours, minutes] = clock.split(":").map(Number);
  return hours * 60 + minutes;
}

/** Is the valve scheduled to be open at this local time? */
export function isValveOpen(schedule: IrrigationSchedule, at: Date): boolean {
  if (!schedule.active_days.includes(at.getDay())) return false;

  const start = toMinutes(schedule.start_time);
  const now = at.getHours() * 60 + at.getMinutes();
  const end = start + schedule.duration_minutes;

  if (end <= DAY_MINUTES) return now >= start && now < end;
  // A run that crosses midnight.
  return now >= start || now < end - DAY_MINUTES;
}
