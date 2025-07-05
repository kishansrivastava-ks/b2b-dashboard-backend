import express from 'express';

const router = express.Router();

import {
  getFeedbackById,
  createFeedback,
  getAllFeedback,
  getFeedbackByVendor,
  updateFeedbackStatus,
} from '../controllers/feedbackController.js';

import { protect } from '../middlewares/authMiddleware.js';

router.get('/', getAllFeedback);

router.get('/:id', protect, getFeedbackById);
router.post('/', protect, createFeedback);
router.get('/vendor/:vendorId', getFeedbackByVendor);

// Admin-only route for moderation
router.put('/:id/status', protect, updateFeedbackStatus);

export default router;
