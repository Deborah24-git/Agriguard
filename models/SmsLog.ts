import { Schema, model, models } from "mongoose";

const smsLogSchema = new Schema({
  alert_id: { type: Schema.Types.ObjectId, ref: "Alert", default: null, index: true },
  sender_id: { type: String, default: null },
  to: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ["sent", "failed", "skipped"],
    required: true,
    index: true,
  },
  provider_id: { type: String, default: null },
  error: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
});

export default models.SmsLog ?? model("SmsLog", smsLogSchema);
