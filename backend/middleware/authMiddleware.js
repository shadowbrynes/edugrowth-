const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'excelmind_super_secret_jwt_key_2025_academic_companion';

    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'status']
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session token: User record no longer exists.'
      });
    }

    if (user.status && user.status.toLowerCase() !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account suspended or inactive. Please contact administration.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('JWT Authentication Error:', err.message);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Invalid or expired token.'
    });
  }
};

module.exports = authMiddleware;
