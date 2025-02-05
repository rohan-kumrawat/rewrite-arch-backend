const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  
  fullname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "client"], default: "client" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);