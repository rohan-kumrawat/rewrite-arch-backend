const mongoose = require("mongoose");

const requirementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  requirement: { type: String, required: true },
  submittedBy: { type: String, enum: ["guest", "client"] },
});

module.exports = mongoose.model("Requirement", requirementSchema);