const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  try {
    // Get the token from the Authorization header: "Bearer <token>"
    const authHeader = req.body.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; // Extract token portion
    if (!token) {
      return res.status(401).json({ message: 'Token missing from header' });
    }

    // Verify the token with your JWT secret
    // (e.g., process.env.JWT_SECRET)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user info to the request (if you want)
    req.user = decoded;
    
    // Continue to next middleware/route
    return next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = verifyToken;
