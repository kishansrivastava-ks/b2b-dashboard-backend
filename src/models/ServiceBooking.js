import mongoose from 'mongoose';

const serviceBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    businessContact: {
      type: String,
      required: true,
    },
    representativeName: {
      type: String,
      default: 'Not Available',
    },
    representativeContact: {
      type: String,
      default: 'Not Available',
    },
    gstNumber: {
      type: String,
      default: 'Not Available',
    },
    services: {
      type: [String],
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    newCustomer: {
      type: Boolean,
      required: true,
    },
    additionalServices: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['in progress', 'vendor assigned', 'work in progress', 'completed'],
      default: 'in progress',
    },
    quotation: {
      type: String,
      default: null,
    },
    quotationApproved: {
      type: Boolean,
      default: null,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor  ',
      default: null,
    },
    vendorName: {
      type: String,
      default: 'Not Assigned',
    },
    vendorContact: {
      type: String,
      default: 'Not Assigned',
    },
    invoice: {
      type: String,
      default: null,
    },

    feedbackProvided: {
      type: Boolean,
      default: false,
    },
    feedbackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feedback',
      required: false,
    },
  },
  { timestamps: true },
);

const ServiceBooking = mongoose.model('ServiceBooking', serviceBookingSchema);
export default ServiceBooking;
