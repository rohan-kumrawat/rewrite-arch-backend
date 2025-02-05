const axios = require("axios");

const sendEmail = async (to, subject, html) => {
  const data = {
    sender: { email: process.env.BREVO_FROM_EMAIL },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  };

  try {
    await axios.post("https://api.brevo.com/v3/smtp/email", data, {
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;