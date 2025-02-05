const app = require("./app");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

// Database connection (SIRF YAHI PE CALL KAREN)
connectDB();

// Start server
try {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Server startup error:", error);
}
