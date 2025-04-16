import mongoose from "mongoose";

const ShowSchema = new mongoose.Schema({
  showDate: {
    type: String,
    required: true,
  },
  numberOfShows: {
    type: Number,
    required: true,
    min: 1,
  },
  shows: [
    {
      timing: {
        type: String,
        required: true,
      },
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

export const Show = mongoose.model("Show", ShowSchema);
