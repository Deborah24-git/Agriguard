import { Schema, model, models } from "mongoose";

const scheduleSchema = new Schema(
  {
    start_time: { type: String, required: true, default: "06:00" },
    duration_minutes: { type: Number, required: true, default: 60 },
    active_days: { type: [Number], default: [0, 1, 2, 3, 4, 5, 6] },
  },
  { _id: false }
);

const pointSchema = new Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, uppercase: true, trim: true },
  crop_type: { type: String, required: true, trim: true },
  area_hectares: { type: Number, required: true },
  expected_flow_rate: { type: Number, required: true },
  min_pressure: { type: Number, required: true },
  max_pressure: { type: Number, required: true },
  schedule: { type: scheduleSchema, default: () => ({}) },
  is_active: { type: Boolean, default: true },
  owner_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  /** Demo-only: which fault the simulator should bake into this point. */
  simulated_fault: {
    type: String,
    enum: ["none", "leak", "blockage", "pressure_drop", "no_flow"],
    default: "none",
  },
  created_at: { type: Date, default: Date.now },
});

pointSchema.index({ owner_id: 1, code: 1 }, { unique: true });

export default models.Point ?? model("Point", pointSchema);
