const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const config = require('../config/config');

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: config.jwtExpire });
};

// @desc    Register admin
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        error: 'Admin with this email or username already exists',
      });
    }

    const admin = await Admin.create({ username, email, password });

    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      data: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login admin
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      data: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current admin
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    next(error);
  }
};
