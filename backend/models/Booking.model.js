// models/Booking.js
const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show",
    required: true,
  },
  seatType: {
    type: String,
    enum: ["Balcony", "Ordinary"],
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  spectator: {
    name: {
      type: String,
      required: true,
    },
    paymentInfo: {
      type: String,
      required: true,
    },
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Cancelled"],
    default: "Active",
  },
  cancellation: {
    cancellationDate: {
      type: Date,
    },
    refundAmount: {
      type: Number,
    },
  },
});

export const Booking = mongoose.model("Booking", BookingSchema);
