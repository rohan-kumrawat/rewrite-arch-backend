const express = require("express");
const { submitRequirement } = require("../controllers/guestController");

const router = express.Router();

// Submit requirement form
router.post("/requirements", submitRequirement);

module.exports = router;