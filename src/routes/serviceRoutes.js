import express from 'express';
import {
  bookService,
  getAllBookings,
  getBookingById,
  getMyBookings,
  getQuotation,
  updateServiceBooking,
  uploadQuotation,
} from '../controllers/serviceBookingController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.post('/book-service', protect, bookService);
router.get('/my-bookings', protect, getMyBookings);
router.get('/my-bookings/:bookingId', getBookingById);
// router.get('/my-bookings/:bookingId', protect, getBookingById);
router.get('/bookings', getAllBookings);
router.put('/:bookingId', updateServiceBooking);

// ROUTES FOR QUOTATION UPLOAD AND RETRIEVAL
router.post(
  '/upload-quotation/:id',
  upload.single('quotation'),
  uploadQuotation,
);
router.get('/get-quotation/:id', getQuotation);

export default router;
