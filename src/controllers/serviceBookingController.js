import ServiceBooking from '../models/ServiceBooking.js';
import User from '../models/User.js';

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
      .select(
        'services bookingDate newCustomer additionalServices createdAt updatedAt',
      )
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error while fetching bookings' });
  }
};
