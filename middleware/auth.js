const { verifyToken } = require("../config/jwt");

const authMiddleware = (roleRequired) => (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ error: "No token, access denied" });

  try {
    const decoded = verifyToken(token);

    // Check User's Role
    if (decoded.role !== roleRequired) {
      return res.status(403).json({ error: `${roleRequired} access required` });
    }

    // Add User Fetails
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = {
  adminAuth: authMiddleware("admin"), // For Admin role
  clientAuth: authMiddleware("client") //For Client role
};