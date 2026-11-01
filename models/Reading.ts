import { Schema, model, models } from "mongoose";

const readingSchema = new Schema({
  point_id: { type: Schema.Types.ObjectId, ref: "Point", required: true, index: true },
  sensor_id: { type: Schema.Types.ObjectId, ref: "Sensor", default: null },
  flow_rate: { type: Number, required: true },
  pressure: { type: Number, required: true },
  valve_state: { type: String, enum: ["open", "closed"], required: true },
  source: {
    type: String,
    enum: ["sensor", "simulator", "manual"],
    default: "sensor",
  },
  recorded_at: { type: Date, required: true },
});

readingSchema.index({ point_id: 1, recorded_at: -1 });

export default models.Reading ?? model("Reading", readingSchema);
