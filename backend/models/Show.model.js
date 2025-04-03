import mongoose from "mongoose";

const ShowSchema = new mongoose.Schema({
  showDate: {
    type: Date,
    required: true,
  },
  numberOfShows: {
    type: Number,
    required: true,
    min: 1,
  },
  timings: [
    {
      type: String,
      required: true,
    },
  ],
  seatCategories: [
    {
      category: {
        type: String,
        enum: ["Balcony", "Ordinary"],
        required: true,
      },
      totalSeats: {
        type: Number,
        required: true,
        min: 0,
      },
      availableSeats: {
        type: Number,
        required: true,
        min: 0,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Show", ShowSchema);
