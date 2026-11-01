import { Schema, model, models } from "mongoose";

/** Percentage readings from the ultrasonic probes on the tank and standpipes. */
const levelReadingSchema = new Schema({
  asset: {
    type: String,
    enum: ["tank", "standpipe_1", "standpipe_2", "standpipe_3"],
    required: true,
    index: true,
  },
  level_pct: { type: Number, required: true, min: 0, max: 100 },
  sensor_id: { type: Schema.Types.ObjectId, ref: "Sensor", default: null },
  recorded_at: { type: Date, required: true },
});

levelReadingSchema.index({ asset: 1, recorded_at: -1 });

export default models.LevelReading ?? model("LevelReading", levelReadingSchema);
