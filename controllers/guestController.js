const Requirement = require("../models/Requirement");
const sendEmail  = require("../config/brevo");

//--------------------Submit requirement form----------------
const submitRequirement = async (req, res) => {
  try {
    const requirement = new Requirement({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      requirement: req.body.requirement,
      submittedBy: "guest",
    });
    await requirement.save();

    // Send email notification to admin
    await sendEmail(
      "admin@example.com",
      "New Requirement Submitted",
      `<p>A new requirement has been submitted: ${requirement.requirement}</p>`
    );

    res.status(201).json({ message: "Requirement submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Requirement submission failed", message: error.message });
  }
};

module.exports = { submitRequirement };