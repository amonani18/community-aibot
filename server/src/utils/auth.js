const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        console.log('User not found with token ID');
        return next();
      }

      req.user = user;
      req.token = token;
      next();
    } catch (tokenError) {
      // Handle specific JWT errors
      if (tokenError.name === 'TokenExpiredError') {
        console.log('Token expired');
      } else if (tokenError.name === 'JsonWebTokenError') {
        console.log('Invalid token');
      } else {
        console.log('Token verification error:', tokenError.message);
      }
      next();
    }
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    next();
  }
};

module.exports = auth; 