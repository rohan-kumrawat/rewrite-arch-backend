const Project = require("../models/Project");
const Slider = require("../models/Slider");
const Review = require("../models/Review");
const Requirement = require("../models/Requirement");
const cloudinary = require("../config/cloudinary");
const { uploadProjectImages, uploadSliderImages } = require("../middleware/multer");
const sendEmail = require("../config/brevo");

// --------------Add New Project (with Images)-----------------
const addProject = async (req, res) => {
  try {
    const uploadedImages = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
      );
      uploadedImages.push(result.secure_url);
    }

    const project = new Project({
      projectName: req.body.projectName,
      description: req.body.description,
      clientName: req.body.clientName,
      location: req.body.location,
      features: req.body.features,
      tags: req.body.tags,
      images: uploadedImages,
      status: req.body.status || "Not Started",
      createdBy: req.user.id,
    });

    await project.save();
    res.status(201).json({ message: "Project added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add project", message: error.message });
  }
};

// ---------------Update Project (Add/Replace Images)--------------
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    // Agar naye images upload kiye hain
    if (req.files && req.files.length > 0) {
      const uploadedImages = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
        );
        uploadedImages.push(result.secure_url);
      }
      project.images = [...project.images, ...uploadedImages].slice(0, 3); // Max 3 images
    }

    // Fields update karein
    project.projectName = req.body.projectName || project.projectName;
    project.description = req.body.description || project.description;
    project.clientName = req.body.clientName || project.clientName;
    project.location = req.body.location || project.location;
    project.features = req.body.features || project.features;
    project.tags = req.body.tags || project.tags;
    project.status = req.body.status || project.status;

    await project.save();
    res.json({ message: "Project updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update project", message: error.message });
  }
};

// ----------------------Delete Project--------------------
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    // Cloudinary se images delete karein (optional)
    // project.images.forEach(async (imageUrl) => {
    //   const publicId = imageUrl.split("/").pop().split(".")[0];
    //   await cloudinary.uploader.destroy(publicId);
    // });

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
};

// Upload Slider Images (Max 5)
const uploadSlider = async (req, res) => {
  try {
    const uploadedImages = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
      );
      uploadedImages.push({
        imageUrl: result.secure_url,
        publicId: result.public_id,
        uploadedBy: req.user.id,
      });
    }

    const slider = await Slider.insertMany(uploadedImages);
    res.status(201).json({ message: "Slider images uploaded successfully", slider });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload slider images", message: error.message });
  }
};

// ----------------------------Delete Multiple Slider Images------------------------
const deleteMultipleSliderImages = async (req, res) => {
  try {
    const { ids } = req.body; // Array of Slider IDs: ["id1","id2"]

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Please provide valid slider IDs array" });
    }

    const deletedSliders = [];
    const errors = [];

    // Process each slider ID
    for (const id of ids) {
      try {
        const slider = await Slider.findById(id);
        if (!slider) {
          errors.push({ id, error: "Slider not found" });
          continue;
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(slider.publicId); 

        // Delete from Database
        await Slider.findByIdAndDelete(id);
        deletedSliders.push(id);
      } catch (error) {
        errors.push({ id, error: error.message });
      }
    }

    res.status(200).json({
      success: true,
      message: "Batch delete completed",
      deletedCount: deletedSliders.length,
      deletedSliders,
      errors
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to delete sliders" });
  }
};


//----------------------Get all reviews-----------------------------

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('createdBy', 'User');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews", message: error.message });
  }
};

// Select/deselect reviews (max 5)
const selectReviews = async (req, res) => {
  try {
    const { reviewIds } = req.body;

    // Validation
    if (!reviewIds || !Array.isArray(reviewIds)) {
      return res.status(400).json({ error: "Invalid review IDs" });
    }
    if (reviewIds.length > 5) {
      return res.status(400).json({ error: "Maximum 5 reviews can be selected" });
    }

    // Check if all reviews exist
    const existingReviews = await Review.countDocuments({ _id: { $in: reviewIds } });
    if (existingReviews !== reviewIds.length) {
      return res.status(404).json({ error: "One or more reviews not found" });
    }

    // Deselect all current selected reviews
    await Review.updateMany({ isSelected: true }, { $set: { isSelected: false } });

    // Select the new reviews
    await Review.updateMany(
      { _id: { $in: reviewIds } },
      { $set: { isSelected: true } }
    );

    res.json({ success: true, message: `${reviewIds.length} reviews selected` });
  } catch (error) {
    res.status(500).json({ error: "Failed to update reviews", message: error.message });
  }
};

// ------------------------Delete a Review--------------------
const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete review" });
  }
};

// ----------------------Get All Requirements------------------
const getRequirements = async (req, res) => {
  try {
    const requirements = await Requirement.find();
    res.json(requirements);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requirements" });
  }
};

module.exports = {
  addProject,
  updateProject,
  deleteProject,
  uploadSlider,
  deleteMultipleSliderImages,
  selectReviews,
  deleteReview,
  getRequirements,
  getAllReviews
};