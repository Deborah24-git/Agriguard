import { connectDB } from "@/lib/mongodb";
import { generatePointSample } from "@/lib/simulator/sample";
import { nextLevel } from "@/lib/simulator/level";
import Point from "@/models/Point";
import Sensor from "@/models/Sensor";
import { recordReading } from "@/services/readings/recordReading";
import { recordLevelReading } from "@/services/tank/recordLevelReading";
import { getTankLevels } from "@/services/tank/getTankLevels";
import type { SimulationTickResult } from "@/types/live";

/**
 * One simulator pass: a fresh flow/pressure sample for every point plus a new
 * ultrasonic level for the tank and standpipes. Alerts are raised through the
 * same path as real telemetry, so the demo exercises detection end to end.
 */
export async function runSimulationTick(
  ownerId?: string
): Promise<SimulationTickResult> {
  await connectDB();

  const points = await Point.find(ownerId ? { owner_id: ownerId } : {});
  const flowSensors = await Sensor.find({ type: "flow" }).select("_id point_id");
  const levelSensors = await Sensor.find({ type: "ultrasonic_level" }).select(
    "_id level_asset code"
  );
  const at = new Date();
  const ownerForAlerts = points[0]?.owner_id?.toString();

  let readings = 0;
  let alerts = 0;

  for (const point of points) {
    const sensor = flowSensors.find(
      (candidate) => candidate.point_id?.toString() === point._id.toString()
    );

    const sample = generatePointSample(
      {
        name: point.name,
        expected_flow_rate: point.expected_flow_rate,
        min_pressure: point.min_pressure,
        max_pressure: point.max_pressure,
        schedule: point.schedule,
        simulated_fault: point.simulated_fault,
      },
      at
    );

    const result = await recordReading({
      pointId: point._id.toString(),
      flowRate: sample.flow_rate,
      pressure: sample.pressure,
      valveState: sample.valve_state,
      sensorId: sensor?._id.toString() ?? null,
      recordedAt: at,
      source: "simulator",
    });

    readings += 1;
    if (result.alertRaised) alerts += 1;
  }

  const levels = await getTankLevels();
  for (const level of levels) {
    const levelSensor = levelSensors.find(
      (sensor) =>
        sensor.level_asset === level.asset ||
        (!sensor.level_asset &&
          ((level.asset === "tank" && sensor.code === "SENS-ULT-TANK") ||
            (level.asset === "standpipe_1" && sensor.code === "SENS-ULT-SP")))
    );
    const hours = level.last_reading_at
      ? (at.getTime() - new Date(level.last_reading_at).getTime()) / 3_600_000
      : 0.25;

    const raised = await recordLevelReading({
      asset: level.asset,
      levelPct: nextLevel(level.asset, level.level_pct, hours, at),
      sensorId: levelSensor?._id.toString() ?? null,
      ownerId: ownerForAlerts,
      recordedAt: at,
    });

    if (raised) alerts += 1;
  }

  return { readings, levels: levels.length, alerts };
}
