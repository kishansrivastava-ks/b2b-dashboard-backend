// controllers/feedbackController.js
import Feedback from '../models/Feedback.js';
import ServiceBooking from '../models/ServiceBooking.js';

// @desc    Get feedback by ID
// @route   GET /api/feedback/:id
// @access  Private (Admin/User for their own feedback)
export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('userId', 'name email') // Populate user info
      .populate('serviceBookingId') // Populate service booking info
      .populate('vendorId', 'name'); // Populate vendor info
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.status(200).json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Private (Authenticated User)
export const createFeedback = async (req, res) => {
  const {
    serviceBookingId,
    rating,
    comment,
    timelinessRating,
    qualityRating,
    professionalismRating,
  } = req.body;

  const userId = req.user.id;
  console.log('User ID:', userId);

  try {
    // 1. Check if the service booking exists and is completed
    const serviceBooking = await ServiceBooking.findById(serviceBookingId);
    if (!serviceBooking) {
      return res.status(404).json({ message: 'Service booking not found' });
    }
    if (serviceBooking.status !== 'completed') {
      return res.status(400).json({
        message: 'Feedback can only be provided for completed services',
      });
    }
    if (serviceBooking.feedbackProvided) {
      return res
        .status(400)
        .json({ message: 'Feedback already provided for this service' });
    }
    if (serviceBooking.user.toString() !== userId) {
      return res.status(403).json({
        message: 'Not authorized to provide feedback for this booking',
      });
    }

    // 2. Create the feedback
    const feedback = new Feedback({
      userId,
      serviceBookingId,
      vendorId: serviceBooking.vendorId, // Associate with vendor if assigned
      rating,
      comment,
      timelinessRating,
      qualityRating,
      professionalismRating,
    });

    const createdFeedback = await feedback.save();

    // 3. Update the service booking to mark feedback as provided
    serviceBooking.feedbackProvided = true;
    serviceBooking.feedbackId = createdFeedback._id;
    await serviceBooking.save();

    res.status(201).json(createdFeedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all feedback (for admin or company side)
// @route   GET /api/feedback
// @access  Private (Admin/Company users)
export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({})
      .populate('userId', 'name email')
      .populate('serviceBookingId', 'services');
    //   .populate('vendorId', 'name');
    res.status(200).json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get feedback for a specific vendor (for company side or public vendor profile)
// @route   GET /api/feedback/vendor/:vendorId
// @access  Public/Private
export const getFeedbackByVendor = async (req, res) => {
  try {
    const vendorFeedback = await Feedback.find({
      vendorId: req.params.vendorId,
      status: 'approved',
    }) // Only approved feedback
      .populate('userId', 'name')
      .sort({ feedbackDate: -1 }); // Latest first
    res.status(200).json(vendorFeedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update feedback status (for admin moderation)
// @route   PUT /api/feedback/:id/status
// @access  Private (Admin)
export const updateFeedbackStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    feedback.status = status;
    await feedback.save();
    res
      .status(200)
      .json({ message: 'Feedback status updated successfully', feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
