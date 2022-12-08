import { Schema, model } from "mongoose";

const logSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
  status: { type: String },
});

const LogModel = model("Log", logSchema);

export default LogModel;