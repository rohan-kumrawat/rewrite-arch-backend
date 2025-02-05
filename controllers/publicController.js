const Project = require("../models/Project");
const Review = require("../models/Review");
const Slider = require("../models/Slider");

//------------------Get all projects------------------
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


//--------------------Get selected reviews for homepage (max 5)------------------
const getSelectedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isSelected: true }).limit(5);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

//----------------Get slider images----------------------
const getSliderImages = async (req, res) => {
  try {
    const sliderImages = await Slider.find();
    res.json(sliderImages);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getProjects, getSelectedReviews, getSliderImages };