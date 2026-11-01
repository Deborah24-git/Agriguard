/** Local calendar day key, "YYYY-MM-DD". */
export function dayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Midnight local time, `daysBack` days ago. */
export function rangeStart(daysBack: number): Date {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (daysBack - 1));
  return start;
}

/** Every local day key from `daysBack` days ago through today. */
export function dayKeys(daysBack: number): string[] {
  const keys: string[] = [];
  const cursor = rangeStart(daysBack);

  for (let index = 0; index < daysBack; index += 1) {
    keys.push(dayKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return keys;
}
