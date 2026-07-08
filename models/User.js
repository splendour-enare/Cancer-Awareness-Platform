// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      default: "user"
    },
    // New fields for cancer risk assessments
    breastCancerRisk: { 
      type: String, 
      enum: ["Low Risk / Low Immediate Concern", "Moderate Risk", "High Risk"], 
      default: null 
    },
    prostateCancerRisk: { 
      type: String, 
      enum: ["Low Risk / Low Immediate Concern", "Moderate Risk", "High Risk"], 
      default: null 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);