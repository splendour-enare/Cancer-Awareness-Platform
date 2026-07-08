// middleware/authMiddleware.js

exports.isAdmin = (req, res, next) => {
  // Later: check req.user.role === "admin"
  next();
};