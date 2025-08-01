import User from '../models/User.js';
import express from 'express';

// ------------------ CONTROLLERS-------------------
export const authenticateService = async (req, res, next) => {
  const serviceToken =
    req.headers['x-service-token'] ||
    req.headers['authorization']?.replace('Bearer ', '');

  if (!serviceToken) {
    return res.status(401).json({ message: 'Service token required' });
  }

  //   validate against a list of known service tokens
  const validServiceToken = process.env.VALID_SERVICE_TOKENS?.split(',') || [];

  if (!validServiceToken.includes(serviceToken)) {
    return res.status(401).json({
      message: 'Invalid service token',
    });
  }

  next();
};

export const getAllUsersForService = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      message: 'Users retrieved successfully',
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server failed while fetching users!',
      error,
    });
  }
};

// -------------------- ROUTES ----------------------
const router = express.Router();
router.get('/users', authenticateService, getAllUsersForService);

export default router;

// -------------------- ROUTES ----------------------
