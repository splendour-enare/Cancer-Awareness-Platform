const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    cancerType: {
      type: String,
      enum: ["breast", "prostate"],
      required: true
    },
    category: {
      type: String,
      enum: ["prevention", "risks"],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    image: {
      type: String, // stores file path
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);