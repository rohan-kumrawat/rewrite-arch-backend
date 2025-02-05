const multer = require("multer");

const uploadProjectImages = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 3 }, // Max 3 images (5MB each)
});

const uploadSliderImages = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 5 }, // Max 5 images (5MB each)
});

module.exports = { uploadProjectImages, uploadSliderImages };