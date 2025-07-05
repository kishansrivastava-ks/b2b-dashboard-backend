import ServiceBooking from '../models/ServiceBooking.js';
import User from '../models/User.js';
import path from 'path';
import fs from 'fs';

export const bookService = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { services, bookingDate, newCustomer, additionalServices } = req.body;

    if (!services || !Array.isArray(services) || services.length === 0)
      return res
        .status(400)
        .json({ message: 'At least one service is required' });

    if (!bookingDate || typeof newCustomer === 'undefined')
      return res
        .status(400)
        .json({ message: 'Missing required booking details' });

    const newBooking = new ServiceBooking({
      user: user._id,
      businessName: user.name,
      businessContact: user.contact,
      representativeName: user.representativeName || 'Not Available',
      representativeContact: user.representativeContact || 'Not Available',
      gstNumber: user.gstNumber || 'Not Available',
      services,
      bookingDate,
      newCustomer,
      additionalServices: additionalServices || '',
    });

    await newBooking.save();
    res
      .status(201)
      .json({ message: 'Service booked successfully', booking: newBooking });
  } catch (error) {
    console.error('Service booking error:', error);
    res.status(500).json({ message: 'Server error while booking service' });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await ServiceBooking.find({ user: userId })
      // .select(
      //   'services bookingDate newCustomer additionalServices createdAt updatedAt',
      // )
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error while fetching bookings' });
  }
};

export const getBookingById = async (req, res) => {
  try {
    // const userId = req.user.id;
    const { bookingId } = req.params;

    const booking = await ServiceBooking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // if (booking.user.toString() !== userId) {
    //   return res
    //     .status(403)
    //     .json({ message: 'Unauthorized access to this booking' });
    // }

    res.status(200).json({ booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res
      .status(500)
      .json({ message: 'Server error while fetching booking details' });
  }
};

// get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await ServiceBooking.find({})
      .populate(
        'user',
        'name contact representativeName representativeContact gstNumber',
      )

      .sort({ createdAt: -1 });
    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res
      .status(500)
      .json({ message: 'Server error while fetching all bookings' });
  }
};

// UPLOAD QUOTATION
export const uploadQuotationController = async (req, res) => {
  try {
    const bookingId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const updated = await ServiceBooking.findByIdAndUpdate(
      bookingId,
      { quotation: req.file.path },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Quotation uploaded successfully', booking: updated });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// RETRIEVE QUOTATION
export const getQuotation = async (req, res) => {
  try {
    const booking = await ServiceBooking.findById(req.params.id);
    if (!booking || !booking.quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    const filePath = path.resolve(booking.quotation);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File does not exist' });
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error('Retrieval error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/service/:bookingId
export const updateServiceBooking = async (req, res) => {
  const { bookingId } = req.params;
  const updateData = req.body;

  try {
    const booking = await ServiceBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update the fields
    Object.keys(updateData).forEach((key) => {
      booking[key] = updateData[key];
    });

    const updatedBooking = await booking.save();

    res.status(200).json({
      message: 'Booking updated successfully',
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('Error updating service booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPLOAD INVOICE
export const uploadInvoiceController = async (req, res) => {
  try {
    const bookingId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const updated = await ServiceBooking.findByIdAndUpdate(
      bookingId,
      { invoice: req.file.path },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Invoice uploaded successfully', booking: updated });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// RETRIEVE INVOICE
export const getInvoice = async (req, res) => {
  try {
    const booking = await ServiceBooking.findById(req.params.id);
    if (!booking || !booking.invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const filePath = path.resolve(booking.invoice);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File does not exist' });
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error('Retrieval error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
