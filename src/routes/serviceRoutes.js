import express from 'express';
import {
  bookService,
  getAllBookings,
  getBookingById,
  getInvoice,
  getMyBookings,
  getQuotation,
  updateServiceBooking,
  uploadInvoiceController,
  uploadQuotationController,
} from '../controllers/serviceBookingController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadQuotation, uploadInvoice } from '../middlewares/upload.js';

const router = express.Router();

router.post('/book-service', protect, bookService);
router.get('/my-bookings', protect, getMyBookings);
router.get('/my-bookings/:bookingId', getBookingById);
// router.get('/my-bookings/:bookingId', protect, getBookingById);
router.get('/bookings', getAllBookings);
router.put('/:bookingId', updateServiceBooking);

// // ROUTES FOR QUOTATION UPLOAD AND RETRIEVAL
// router.post(
//   '/upload-quotation/:id',
//   upload.single('quotation'),
//   uploadQuotation,
// );
// router.get('/get-quotation/:id', getQuotation);

// // ROUTES FOR INVOICE UPLOAD AND RETRIEVAL
// router.post('/upload-invoice/:id', upload.single('invoice'), uploadInvoice);
// router.get('/get-invoice/:id', getInvoice);

// QUOTATION ROUTES
router.post(
  '/upload-quotation/:id',
  uploadQuotation.single('quotation'),
  uploadQuotationController,
);
router.get('/get-quotation/:id', getQuotation);

// INVOICE ROUTES
router.post(
  '/upload-invoice/:id',
  uploadInvoice.single('invoice'),
  uploadInvoiceController,
);
router.get('/get-invoice/:id', getInvoice);

export default router;
