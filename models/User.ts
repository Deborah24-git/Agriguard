import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ["farmer", "admin"], default: "farmer" },
  farm_name: { type: String, default: "My farm" },
  phone: { type: String, default: "" },
  created_at: { type: Date, default: Date.now },
});

export default models.User ?? model("User", userSchema);
