const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  publicId: { type: String, required: true }, // Cloudinary public ID
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
});

module.exports = mongoose.model("Slider", sliderSchema);