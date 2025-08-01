import express from 'express';
import authRoutes from './authRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import userRoutes from './userRoutes.js';
import feedbackRoutes from './feedbackRoutes.js';
import externalServiceRoutes from '../controllers/serviceController.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/service', serviceRoutes);
router.use('/user', userRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/external-service', externalServiceRoutes);

export default router;
