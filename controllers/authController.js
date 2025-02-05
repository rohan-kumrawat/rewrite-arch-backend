const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateToken } = require("../config/jwt");
const sendEmail = require("../config/brevo"); // Brevo integration

// ------------------------Client Signup--------------------------------
const clientSignup = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    const existingClient = await User.findOne({ email });
    if (existingClient) return res.status(400).json({ error: "Client already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullname, email, password: hashedPassword });
    await user.save();

    const token = generateToken(user._id,user.email, user.role);
    res.status(201).json({ token,role:user.role });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

//---------------------------Client or Admin Login----------------------
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // User को खोजें
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Password चेक करें
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Token जनरेट करें (role सहित)
    const token = generateToken(user._id, user.email, user.role);
    res.json({ token, role: user.role });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

//------------------------ Forgot Password (Brevo)-----------------------
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const resetToken = generateToken(user._id, user.email, user.role);
    const resetUrl = `https://your-frontend.com/reset-password?token=${resetToken}`;
    const html = `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`;
    await sendEmail(email, "Password Reset Request", html);

    res.json({ message: "Reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

// -------------------------Reset Password-------------------------------
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "Invalid token" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};


module.exports = { clientSignup, forgotPassword, resetPassword, login };