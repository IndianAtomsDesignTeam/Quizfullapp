  const jwt = require('jsonwebtoken');

  const userTypeMiddleware = (req, res, next) => {
    const { authorization } = req.body; // Extract token from the body

    if (!authorization) {
      // No token provided, mark as unauthenticated
      req.user = null;
      return next(); // Continue to route handler
    }

    try {
      // Verify the token
      const decoded = jwt.verify(authorization, process.env.JWT_SECRET);
      req.user = decoded; // Attach decoded user data to req.user
    } catch (err) {
      console.error('Invalid token:', err.message);
      req.user = null; // Invalid token, treat as unauthenticated
    }

    next(); // Proceed to route handler
  };

  module.exports = userTypeMiddleware;

