const express = require("express");
const { clientSignup, forgotPassword, resetPassword, login } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", clientSignup);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;