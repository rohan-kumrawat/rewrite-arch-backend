const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  description: { type: String, required: true },
  clientName: { type: String, required: true },
  location: { type: String, required: true },
  features: { type: [String], required: true },
  tags: { type: [String], required: true },
  images: [String], // Cloudinary URLs
  status: { 
    type: String, 
    enum: ["Not Started", "In Progress", "Completed"], 
    default: "Not Started" 
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
});

module.exports = mongoose.model("Project", projectSchema);