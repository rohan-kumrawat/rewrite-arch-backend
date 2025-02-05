const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  reviewText: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: false },
  isSelected: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Review", reviewSchema);