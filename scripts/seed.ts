import { hash } from "bcryptjs";
import { disconnect } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Alert from "@/models/Alert";
import LevelReading from "@/models/LevelReading";
import Point from "@/models/Point";
import Reading from "@/models/Reading";
import Sensor from "@/models/Sensor";
import SmsLog from "@/models/SmsLog";
import User from "@/models/User";
import { seedAlerts } from "./seed/alerts";
import { buildSchedule, FLOW_SENSORS, POINT_SEEDS } from "./seed/data";
import {
  LEVEL_TARGETS,
  seedLevels,
  seedReadings,
  type SeededPoint,
} from "./seed/history";
import { TANK_ASSET_LABELS, type TankAsset } from "@/types/tank";

async function clearDatabase(): Promise<void> {
  await Promise.all([
    Reading.deleteMany({}),
    LevelReading.deleteMany({}),
    Alert.deleteMany({}),
    SmsLog.deleteMany({}),
    Sensor.deleteMany({}),
    Point.deleteMany({}),
    User.deleteMany({}),
  ]);
}

async function main(): Promise<void> {
  await connectDB();
  await clearDatabase();

  const now = new Date();
  const password = process.env.SEED_DEMO_PASSWORD || "password123";
  const password_hash = await hash(password, 12);

  const farmer = await User.create({
    name: "Thandi Nkosi",
    email: "farmer@agriguard.test",
    password_hash,
    role: "farmer",
    farm_name: "Riverside Farm",
    phone: "+27821234567",
  });

  await User.create({
    name: "Sipho Dlamini",
    email: "admin@agriguard.test",
    password_hash,
    role: "admin",
    farm_name: "AgriGuard Operations",
    phone: "+27839876543",
  });

  const seededPoints: SeededPoint[] = [];
  for (const seed of POINT_SEEDS) {
    const schedule = buildSchedule(seed.offset_hours, now);
    const point = await Point.create({
      name: seed.name,
      code: seed.code,
      crop_type: seed.crop_type,
      area_hectares: seed.area_hectares,
      expected_flow_rate: seed.expected_flow_rate,
      min_pressure: seed.min_pressure,
      max_pressure: seed.max_pressure,
      schedule,
      is_active: true,
      owner_id: farmer._id,
      simulated_fault: seed.fault,
    });
    seededPoints.push({ id: point._id.toString(), seed, schedule });
  }

  const levelSensors = new Map<TankAsset, string>();
  const levelSensorSeeds: Record<
    TankAsset,
    { code: string; battery_pct: number }
  > = {
    tank: { code: "SENS-ULT-TANK", battery_pct: 94 },
    standpipe_1: { code: "SENS-ULT-SP-1", battery_pct: 82 },
    standpipe_2: { code: "SENS-ULT-SP-2", battery_pct: 79 },
    standpipe_3: { code: "SENS-ULT-SP-3", battery_pct: 76 },
  };
  const seededLevelSensors = [];
  for (const [asset, sensorSeed] of Object.entries(levelSensorSeeds) as [
    TankAsset,
    (typeof levelSensorSeeds)[TankAsset],
  ][]) {
    const sensor = await Sensor.create({
      code: sensorSeed.code,
      name: `${TANK_ASSET_LABELS[asset]} ultrasonic`,
      type: "ultrasonic_level",
      level_asset: asset,
      unit: "%",
      location: TANK_ASSET_LABELS[asset],
      battery_pct: sensorSeed.battery_pct,
      last_value: LEVEL_TARGETS[asset].end,
      owner_id: farmer._id,
      last_seen_at: now,
    });
    levelSensors.set(asset, sensor._id.toString());
    seededLevelSensors.push({
      id: sensor._id.toString(),
      type: "ultrasonic_level" as const,
      point_id: null,
    });
  }

  const flowSensors = [];
  for (const flow of FLOW_SENSORS) {
    const point = seededPoints.find((entry) => entry.seed.code === flow.pointCode);
    const sensor = await Sensor.create({
      code: flow.code,
      name: flow.name,
      type: "flow",
      unit: "L/min",
      location: flow.location,
      battery_pct: flow.battery_pct,
      owner_id: farmer._id,
      point_id: point?.id ?? null,
      last_seen_at: now,
    });
    flowSensors.push({ id: sensor._id.toString(), point_id: point?.id ?? null, type: "flow" as const });
  }

  const leakSensor = await Sensor.create({
    code: "SENS-LEAK-MAIN",
    name: "Main line leak pad",
    type: "leak",
    unit: "%",
    location: "Main supply line",
    battery_pct: 71,
    last_value: 0,
    owner_id: farmer._id,
    last_seen_at: now,
  });

  const drainSensor = await Sensor.create({
    code: "SENS-DRAIN-01",
    name: "Drain sump ultrasonic",
    type: "drain_ultrasonic",
    unit: "%",
    location: "Drain sump",
    battery_pct: 64,
    last_value: 4,
    owner_id: farmer._id,
    last_seen_at: now,
  });

  const sensors = [
    ...seededLevelSensors,
    ...flowSensors,
    { id: leakSensor._id.toString(), type: "leak" as const, point_id: null },
    { id: drainSensor._id.toString(), type: "drain_ultrasonic" as const, point_id: null },
  ];

  const lastSamples = await seedReadings(seededPoints, sensors);
  await seedLevels(Object.fromEntries(levelSensors));

  for (const sensor of flowSensors) {
    const sample = sensor.point_id ? lastSamples.get(sensor.point_id) : null;
    if (sample) {
      await Sensor.findByIdAndUpdate(sensor.id, { last_value: sample.flow_rate });
    }
  }

  const alerts = await seedAlerts(
    farmer._id.toString(),
    seededPoints,
    sensors,
    lastSamples
  );

  console.log("Seed complete");
  console.log(`  users:    2 (farmer@agriguard.test / admin@agriguard.test)`);
  console.log(`  points:   ${seededPoints.length} (A-E)`);
  console.log(`  sensors:  11`);
  console.log(`  readings: ${await Reading.countDocuments()} flow samples`);
  console.log(`  levels:   ${await LevelReading.countDocuments()} ultrasonic samples`);
  console.log(`  alerts:   ${alerts} (plus SMS log entries)`);

  await disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await disconnect();
  process.exit(1);
});
