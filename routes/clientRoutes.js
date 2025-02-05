const express = require("express");
const { clientAuth } = require("../middleware/auth");
const { submitReview } = require("../controllers/clientController");

const router = express.Router();

// Submit a review
router.post("/reviews", clientAuth, submitReview);

module.exports = router;