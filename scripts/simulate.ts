import { disconnect } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { runSimulationTick } from "@/services/simulator/runSimulationTick";

/**
 * Writes one simulator tick by hand:
 *   npm run simulate
 * Useful for cron or for nudging the dashboard without opening the browser.
 */
async function main(): Promise<void> {
  await connectDB();

  const result = await runSimulationTick();
  console.log(
    `Simulated ${result.readings} point readings, ${result.levels} tank levels, ${result.alerts} new alert(s).`
  );

  await disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await disconnect();
  process.exit(1);
});
