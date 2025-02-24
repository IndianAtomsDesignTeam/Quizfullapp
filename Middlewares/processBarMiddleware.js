async function authenticateUser(req, res, next) {
    const userId = req.headers["user-id"]; // Get user ID from headers (or JWT token)
  
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    req.userId = userId;
    next();
  }
  
  module.exports = { authenticateUser };
  