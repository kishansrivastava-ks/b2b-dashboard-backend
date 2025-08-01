import express from 'express';
import { getAllUsers, updateProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllUsers);
router.put('/update-profile', protect, updateProfile);

export default router;
