import { Schema, model, models } from "mongoose";

const alertSchema = new Schema({
  owner_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  point_id: { type: Schema.Types.ObjectId, ref: "Point", default: null, index: true },
  sensor_id: { type: Schema.Types.ObjectId, ref: "Sensor", default: null },
  type: {
    type: String,
    enum: ["leak", "blockage", "pressure_drop", "no_flow", "low_tank"],
    required: true,
  },
  severity: {
    type: String,
    enum: ["critical", "warning", "info"],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ["open", "acknowledged", "resolved"],
    default: "open",
    index: true,
  },
  flow_rate: { type: Number, default: 0 },
  pressure: { type: Number, default: 0 },
  detected_at: { type: Date, default: Date.now },
  acknowledged_at: { type: Date, default: null },
  resolved_at: { type: Date, default: null },
  sms_status: {
    type: String,
    enum: ["sent", "failed", "skipped", null],
    default: null,
  },
});

alertSchema.index({ point_id: 1, type: 1, detected_at: -1 });

export default models.Alert ?? model("Alert", alertSchema);
