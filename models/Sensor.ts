import { Schema, model, models } from "mongoose";

const sensorSchema = new Schema({
  code: { type: String, required: true, uppercase: true, trim: true, unique: true },
  name: { type: String, required: true, trim: true },
  type: {
    type: String,
    required: true,
    enum: ["ultrasonic_level", "flow", "leak", "drain_ultrasonic"],
    index: true,
  },
  level_asset: {
    type: String,
    enum: ["tank", "standpipe_1", "standpipe_2", "standpipe_3"],
    default: null,
    index: true,
  },
  unit: { type: String, required: true },
  location: { type: String, required: true },
  status: {
    type: String,
    enum: ["online", "offline", "fault"],
    default: "online",
  },
  battery_pct: { type: Number, default: 100 },
  last_value: { type: Number, default: null },
  point_id: { type: Schema.Types.ObjectId, ref: "Point", default: null, index: true },
  owner_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  last_seen_at: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
});

export default models.Sensor ?? model("Sensor", sensorSchema);
