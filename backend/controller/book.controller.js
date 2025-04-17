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
  try {
    const { bookingId, refundAmount } = req.body;

    // Validate input
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a booking ID",
      });
    }
    if (refundAmount === undefined || refundAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid refund amount",
      });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if booking is already cancelled
    if (booking.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    // Find the corresponding show
    const show = await Show.findById(booking.show);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    // Find the show timing
    const showTiming = show.shows.find((s) => s.timing === booking.showTime);

    if (!showTiming) {
      return res.status(404).json({
        success: false,
        message: "Show timing not found",
      });
    }

    // Find the seat category
    const seatCategory = showTiming.seatCategories.find(
      (category) => category.category === booking.seatType
    );

    if (!seatCategory) {
      return res.status(404).json({
        success: false,
        message: `Seat category '${booking.seatType}' not found for this show timing`,
      });
    }

    // Update the booking to cancelled status and set cancellation details
    booking.status = "Cancelled";
    booking.cancellation = {
      cancellationDate: new Date(),
      refundAmount: refundAmount,
    };

    // Save the updated booking
    await booking.save();

    // Increment available seats
    seatCategory.availableSeats += 1;

    // Save the updated show
    await show.save();

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};

export const getSalesData = async (req, res) => {
  try {
    const { salespersonId } = req.body;
    const allSales = await Booking.find({ bookedBy: salespersonId }).populate(
      "show",
      "showDate"
    );

    if (!allSales || allSales.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No sales found",
      });
    }

    // Initialize counters
    let totalActiveTicketAmount = 0;
    let balconyTicketCount = 0;
    let ordinaryTicketCount = 0;
    let totalTickets = allSales.length;
    let activeTickets = 0;
    let cancelledTickets = 0;
    allSales.forEach((booking) => {
      if (booking.seatType === "Balcony") {
        balconyTicketCount++;
      } else if (booking.seatType === "Ordinary") {
        ordinaryTicketCount++;
      }

      if (booking.status === "Active") {
        activeTickets++;
        totalActiveTicketAmount += booking.ticketPrice;
      } else if (booking.status === "Cancelled") {
        cancelledTickets++;
      }
    });
    const commission = totalActiveTicketAmount * 0.05;

    return res.status(200).json({
      success: true,
      data: {
        salespersonId,
        salesMetrics: {
          totalTickets,
          activeTickets,
          cancelledTickets,
          balconyTickets: balconyTicketCount,
          ordinaryTickets: ordinaryTicketCount,
          totalSalesAmount: totalActiveTicketAmount,
          commission: commission.toFixed(2),
        },
        allSales,
      },
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch sales data",
      error: error.message,
    });
  }
};
