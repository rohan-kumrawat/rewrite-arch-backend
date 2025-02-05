const express = require("express");
const { adminAuth } = require("../middleware/auth");
const {
  addProject,
  updateProject,
  deleteProject,
  uploadSlider,
  selectReviews,
  deleteReview,
  getRequirements,
  deleteMultipleSliderImages,
  getAllReviews
} = require("../controllers/adminController");
const { uploadProjectImages, uploadSliderImages } = require("../middleware/multer");

const router = express.Router();

// Project Management
router.post("/projects", adminAuth, uploadProjectImages.array("images", 3), addProject); // Max 3 images
router.put("/projects/:id", adminAuth, uploadProjectImages.array("images", 3), updateProject); // Add/Replace images
router.delete("/projects/:id", adminAuth, deleteProject);

// Slider Management
router.post("/slider", adminAuth, uploadSliderImages.array("images", 5), uploadSlider); // Max 5 images
router.delete("/slider", adminAuth, deleteMultipleSliderImages);

// Review Management
router.get("/reviews", adminAuth, getAllReviews); // View all
router.put("/reviews/select", adminAuth, selectReviews); // Select/deselect
router.delete("/reviews/:id", adminAuth, deleteReview); // Delete

// Requirement Management
router.get("/requirements", adminAuth, getRequirements); // View all

module.exports = router;