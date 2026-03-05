const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Admin = require('../models/Admin');

const auth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route',
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.admin = await Admin.findById(decoded.id);
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        error: 'Admin not found',
      });
    }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route',
    });
  }
};

module.exports = auth;
