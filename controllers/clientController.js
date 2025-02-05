const Review = require("../models/Review");
const sendEmail = require("../config/brevo");

// ------------------Submit a review-----------------
const submitReview = async (req, res) => {
  try {
    //console.log(req.body);
    const review = new Review({
      clientName: req.body.clientName,
      reviewText: req.body.reviewText,
      rating: req.body.rating,
      project: req.body.project,
      createdBy: req.client.id,
    });
    await review.save();

    //Send email notification to admin
   try{
     await sendEmail(
      "rohanrkmail2@gmail.com",
      "New Review Posted",
      `<p>A new review has been posted: ${review.reviewText}</p>`
    );
  } catch (emailError){
    console.log("Email Failed : ",emailError);
  }

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    res.status(500).json({ error: "Review submission failed", message: error.message });
  }
};

module.exports = { submitReview };