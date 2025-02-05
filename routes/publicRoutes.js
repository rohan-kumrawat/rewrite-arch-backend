const express = require("express");
const { getProjects, getSelectedReviews, getSliderImages } = require("../controllers/publicController");

const router = express.Router();

// Public routes
router.get("/projects", getProjects);
router.get("/reviews", getSelectedReviews);
router.get("/slider", getSliderImages);

module.exports = router;