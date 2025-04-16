import { Booking } from "../models/Booking.model.js";
import { Show } from "../models/Show.model.js";

export const createBooking = async (req, res) => {
  try {
    const {
      showId,
      timing,
      seatType,
      seatNumber,
      spectatorName,
      paymentInfo,
      bookedBy,
    } = req.body;

    if (
      !showId ||
      !timing ||
      !seatType ||
      !seatNumber ||
      !spectatorName ||
      !paymentInfo ||
      !bookedBy
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    const showTiming = show.shows.find((s) => s.timing === timing);

    if (!showTiming) {
      return res.status(404).json({
        success: false,
        message: "Show timing not found",
      });
    }

    const seatCategory = showTiming.seatCategories.find(
      (category) => category.category === seatType
    );

    if (!seatCategory) {
      return res.status(404).json({
        success: false,
        message: `Seat category '${seatType}' not found for this show timing`,
      });
    }

    if (seatCategory.availableSeats <= 0) {
      return res.status(400).json({
        success: false,
        message: `No ${seatType} seats available for this show timing`,
      });
    }

    const booking = await Booking.create({
      show: showId,
      seatType,
      seatNumber,
      spectator: {
        name: spectatorName,
        paymentInfo,
      },
      bookedBy,
      ticketPrice: seatCategory.price,
      status: "Active",
      showTime: timing,
    });

    seatCategory.availableSeats -= 1;
    await show.save();

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const bookings = await Booking.find({ bookedBy: userId })
      .populate({
        path: "show",
        select: "showDate",
      })
      .sort({ createdAt: -1 });

    const formattedBookings = bookings.map((booking) => {
      const show = booking.show;
      const showTiming = show?.shows?.find((s) =>
        s.seatCategories.some((cat) => cat.category === booking.seatType)
      );

      return {
        id: booking._id,
        showDate: show ? show.showDate : "",
        showTime: booking.showTime,
        seatType: booking.seatType,
        seatNumber: booking.seatNumber,
        spectatorName: booking.spectator.name,
        ticketPrice: booking.ticketPrice,
        status: booking.status,
        bookingDate: booking.createdAt,
        paymentInfo: booking.spectator.paymentInfo,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: formattedBookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

export const cancelBooking = async (req, res) => {
  const { bookingId } = req.body;
};
