import express from 'express';
import {
  bookService,
  getMyBookings,
} from '../controllers/serviceBookingController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/book-service', protect, bookService);
router.get('/my-bookings', protect, getMyBookings);

export default router;
