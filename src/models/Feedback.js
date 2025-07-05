import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceBooking',
      required: true,
      unique: true, // A user can provide feedback only once per booking
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: false,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    feedbackDate: {
      type: Date,
      default: Date.now,
    },
    // Optional: Fields for specific aspects of the service
    timelinessRating: { type: Number, min: 1, max: 5 },
    qualityRating: { type: Number, min: 1, max: 5 },
    professionalismRating: { type: Number, min: 1, max: 5 },
    // Optional: Status for admin review (e.g., 'pending', 'approved', 'rejected')
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
