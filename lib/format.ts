import { DETECTION } from "@/lib/detection/config";
import type { ReadingPoint, ValveState } from "@/types/reading";

export function formatLitres(litres: number): string {
  if (litres >= 1_000_000) return `${(litres / 1_000_000).toFixed(2)} ML`;
  if (litres >= 1000) return `${(litres / 1000).toFixed(1)} kL`;
  return `${Math.round(litres)} L`;
}

export function formatFlow(lpm: number | null): string {
  if (lpm === null) return "—";
  return `${lpm.toFixed(1)} L/min`;
}

export function formatPressure(kpa: number | null): string {
  if (kpa === null) return "—";
  return `${Math.round(kpa)} kPa`;
}

export function formatClock(iso: string | Date): string {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  return date.toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatDate(iso: string | Date): string {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  return date.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatRelative(iso: string | Date): string {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.round(hours / 24)} d ago`;
}

export function describeValve(valve: ValveState | null): string {
  if (valve === null) return "Unknown";
  return valve === "open" ? "Valve open" : "Valve closed";
}

/** Is a reading old enough that the sensor should be treated as offline? */
export function isStale(reading: ReadingPoint | null): boolean {
  if (!reading) return true;
  const ageMinutes = (Date.now() - reading.recorded_at.getTime()) / 60000;
  return ageMinutes > DETECTION.offlineMinutes;
}
