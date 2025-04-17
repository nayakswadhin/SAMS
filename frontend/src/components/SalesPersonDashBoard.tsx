import React, { useEffect, useState } from "react";
import {
  Building2,
  Calendar,
  Clock,
  Users,
  X,
  Ticket,
  CheckCircle2,
  History,
  Banknote,
  XCircle,
  AlertCircle,
  User,
  CreditCard,
  Armchair,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

interface SeatCategory {
  _id: string;
  category: "Balcony" | "Ordinary";
  totalSeats: number;
  availableSeats: number;
  price: number;
}

interface ShowTiming {
  _id: string;
  timing: string;
  seatCategories: SeatCategory[];
}

interface Show {
  _id: string;
  showDate: string;
  numberOfShows: number;
  shows: ShowTiming[];
  managerId: string;
  createdAt: string;
}

interface Booking {
  id: string;
  showDate: string;
  showTime: string;
  seatType: "Balcony" | "Ordinary";
  seatNumber: string;
  spectatorName: string;
  ticketPrice: number;
  status: "Active" | "Cancelled";
  bookingDate?: string;
  paymentInfo?: string;
}

interface BookingFormData {
  showId: string;
  showIndex: number;
  seatType: "Balcony" | "Ordinary";
  seatNumber: string;
  spectatorName: string;
  paymentInfo: string;
}

interface CancelModalProps {
  booking: Booking;
  onClose: () => void;
  onConfirm: (bookingId: string, refundAmount: number) => void;
}

function CancelBookingModal({ booking, onClose, onConfirm }: CancelModalProps) {
  const calculateRefundAmount = (booking: Booking): number => {
    const showDate = new Date(booking.showDate);
    const today = new Date();
    const daysUntilShow = Math.ceil(
      (showDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    const ticketPrice = booking.ticketPrice;

    if (daysUntilShow > 3) {
      return ticketPrice - 5;
    } else if (daysUntilShow > 1) {
      const deduction = booking.seatType === "Balcony" ? 15 : 10;
      return ticketPrice - deduction;
    } else if (daysUntilShow >= 0) {
      return ticketPrice * 0.5;
    }
    return 0;
  };

  const refundAmount = calculateRefundAmount(booking);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-500" size={24} />
            <h2 className="text-xl font-semibold">Cancel Booking</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Calendar size={14} />
              Show Date: {new Date(booking.showDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Clock size={14} />
              Show Time: {booking.showTime || "Not specified"}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Ticket size={14} />
              {booking.seatType} - Seat {booking.seatNumber}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Users size={14} />
              Spectator: {booking.spectatorName}
            </p>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Ticket Price:</span>
              <span className="font-medium">₹{booking.ticketPrice}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Refund Amount:</span>
              <span className="font-medium text-green-600">
                ₹{refundAmount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Deduction:</span>
              <span className="font-medium text-red-600">
                ₹{(booking.ticketPrice - refundAmount).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
            >
              Keep Booking
            </button>
            <button
              onClick={() => onConfirm(booking.id, refundAmount)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <XCircle size={18} />
              Cancel Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SalespersonDashboard({ onLogout, user }) {
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedShow, setSelectedShow] = useState<{
    show: Show;
    showIndex: number;
  } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBookingForCancel, setSelectedBookingForCancel] =
    useState<Booking | null>(null);
  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    showId: "",
    showIndex: 0,
    seatType: "Ordinary",
    seatNumber: "",
    spectatorName: "",
    paymentInfo: "",
  });
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  const salesperson = JSON.parse(localStorage.getItem("user") || "{}");
  const managerId = salesperson.managerId;

  // Fetch shows
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.post(
          "https://sams-backend-tbjv.onrender.com/getShows",
          {
            managerId: managerId,
          }
        );
        setShows(response.data.shows);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch shows");
        setLoading(false);
      }
    };

    fetchShows();
  }, [managerId]);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setBookingsLoading(true);
        const response = await axios.post(
          "https://sams-backend-tbjv.onrender.com/getBookings",
          {
            userId: salesperson._id,
          }
        );

        if (response.data.success) {
          setBookings(response.data.data);
        } else {
          setBookingsError("Failed to fetch bookings");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookingsError("Failed to fetch bookings. Please try again.");
      } finally {
        setBookingsLoading(false);
      }
    };
    if (salesperson._id) {
      fetchBookings();
    } else {
      setBookingsLoading(false);
    }
  }, [salesperson._id]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShow) return;

    try {
      const selectedSeatCategory = selectedShow.show.shows[
        selectedShow.showIndex
      ].seatCategories.find((cat) => cat.category === bookingForm.seatType);

      if (!selectedSeatCategory) {
        setError("Selected seat category not found");
        return;
      }

      const bookingData = {
        showId: selectedShow.show._id,
        timing: selectedShow.show.shows[selectedShow.showIndex].timing,
        seatType: bookingForm.seatType,
        seatNumber: bookingForm.seatNumber,
        spectatorName: bookingForm.spectatorName,
        paymentInfo: bookingForm.paymentInfo,
        bookedBy: salesperson._id,
      };

      const response = await axios.post(
        "https://sams-backend-tbjv.onrender.com/book-seat",
        bookingData
      );

      if (response.data.success) {
        // Create a new booking object from the response
        const newBooking: Booking = {
          id: response.data.data._id,
          showDate: selectedShow.show.showDate,
          showTime: selectedShow.show.shows[selectedShow.showIndex].timing,
          seatType: bookingForm.seatType,
          seatNumber: bookingForm.seatNumber,
          spectatorName: bookingForm.spectatorName,
          ticketPrice: selectedSeatCategory.price,
          status: "Active",
          paymentInfo: bookingForm.paymentInfo,
        };

        // Update the bookings state with the new booking
        setBookings([newBooking, ...bookings]);

        // Reset form state
        setBookingForm({
          showId: "",
          showIndex: 0,
          seatType: "Ordinary",
          seatNumber: "",
          spectatorName: "",
          paymentInfo: "",
        });
        setSelectedShow(null);

        // Refresh shows to update available seats
        const showsResponse = await axios.post(
          "https://sams-backend-tbjv.onrender.com/getShows",
          {
            managerId: managerId,
          }
        );
        setShows(showsResponse.data.shows);
      } else {
        setError(response.data.message || "Failed to create booking");
      }
    } catch (err) {
      console.error("Error creating booking:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create booking. Please try again."
      );
    }
  };

  const handleCancelBooking = async (
    bookingId: string,
    refundAmount: number
  ) => {
    try {
      // Call the cancelBooking API
      const response = await axios.post(
        "https://sams-backend-tbjv.onrender.com/cancelBooking",
        {
          bookingId,
          refundAmount,
        }
      );

      if (response.data.success) {
        // Update bookings state to reflect cancelled status
        setBookings(
          bookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: "Cancelled" }
              : booking
          )
        );

        // Refresh bookings from server to ensure consistency
        const bookingsResponse = await axios.post(
          "https://sams-backend-tbjv.onrender.com/getBookings",
          {
            userId: salesperson._id,
          }
        );

        if (bookingsResponse.data.success) {
          setBookings(bookingsResponse.data.data);
        }

        // Refresh shows to update available seats
        const showsResponse = await axios.post(
          "https://sams-backend-tbjv.onrender.com/getShows",
          {
            managerId: managerId,
          }
        );
        setShows(showsResponse.data.shows);

        setSelectedBookingForCancel(null);
      } else {
        setError(response.data.message || "Failed to cancel booking");
      }
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setError(
        err.response?.data?.message ||
          "Failed to cancel booking. Please try again."
      );
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";

    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {selectedBookingForCancel && (
        <CancelBookingModal
          booking={selectedBookingForCancel}
          onClose={() => setSelectedBookingForCancel(null)}
          onConfirm={handleCancelBooking}
        />
      )}

      <nav className="bg-white shadow-lg backdrop-blur-lg bg-opacity-90 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Building2 size={28} className="text-blue-600 animate-pulse" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                SAMS Dashboard
              </h1>
            </div>
            <button
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Shows List */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Calendar size={24} className="text-blue-600" />
                <h2 className="text-xl font-semibold">Available Shows</h2>
              </div>
              <div className="space-y-6">
                {shows.map((show) => (
                  <div
                    key={show._id}
                    className="border border-gray-100 rounded-xl p-4 transition-all duration-300 hover:border-blue-200"
                  >
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={18} className="text-blue-600" />
                        <h3 className="text-lg font-medium">
                          {formatDate(show.showDate)}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <History size={14} />
                        {show.numberOfShows} show
                        {show.numberOfShows > 1 ? "s" : ""} scheduled
                      </p>
                    </div>

                    <div className="space-y-4">
                      {show.shows.map((showTiming, index) => (
                        <div
                          key={`${show._id}-${index}`}
                          className="bg-gray-50 rounded-xl p-4 transition-all duration-300 hover:bg-gray-100"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-blue-600" />
                              <span className="font-medium">
                                {showTiming.timing}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                setSelectedShow({ show, showIndex: index })
                              }
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                            >
                              <Ticket size={16} />
                              Book Show
                            </button>
                          </div>

                          <div className="space-y-2 text-sm text-gray-600">
                            {showTiming.seatCategories.map((category) => (
                              <div
                                key={category._id}
                                className="flex items-center gap-2 bg-white p-2 rounded-lg"
                              >
                                <Users size={16} className="text-blue-600" />
                                <span className="flex-1">
                                  {category.category}
                                </span>
                                <span className="text-blue-600 font-medium flex items-center gap-1">
                                  <Banknote size={14} />₹{category.price}
                                </span>
                                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs">
                                  {category.availableSeats} available
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            {/* Booking Form */}
            {selectedShow && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl p-8 shadow-xl backdrop-blur-lg bg-opacity-95 border border-gray-100"
              >
                <div className="flex justify-between items-center mb-8">
                  <motion.div initial={{ x: -20 }} animate={{ x: 0 }}>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text mb-2">
                      Book Tickets
                    </h2>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar size={16} className="text-blue-600" />
                      {formatDate(selectedShow.show.showDate)} at{" "}
                      {selectedShow.show.shows[selectedShow.showIndex].timing}
                    </p>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedShow(null)}
                    className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                <motion.form
                  onSubmit={handleBookingSubmit}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Armchair size={18} className="text-blue-600" />
                      Seat Type
                    </label>
                    <div className="relative">
                      <select
                        value={bookingForm.seatType}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            seatType: e.target.value as "Balcony" | "Ordinary",
                          })
                        }
                        className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white appearance-none"
                        required
                      >
                        {selectedShow.show.shows[
                          selectedShow.showIndex
                        ].seatCategories.map((category) => (
                          <option key={category._id} value={category.category}>
                            {category.category} (₹{category.price}) -{" "}
                            {category.availableSeats} available
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Armchair size={18} className="text-blue-600" />
                      Seat Number
                    </label>
                    <input
                      type="text"
                      value={bookingForm.seatNumber}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          seatNumber: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter seat number"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User size={18} className="text-blue-600" />
                      Spectator Name
                    </label>
                    <input
                      type="text"
                      value={bookingForm.spectatorName}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          spectatorName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter spectator name"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <CreditCard size={18} className="text-blue-600" />
                      Payment Information
                    </label>
                    <input
                      type="text"
                      value={bookingForm.paymentInfo}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          paymentInfo: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter payment information"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="pt-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3 font-medium"
                    >
                      <CheckCircle2 size={20} />
                      Confirm Booking
                    </motion.button>
                  </motion.div>
                </motion.form>
              </motion.div>
            )}

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <History size={24} className="text-blue-600" />
                <h2 className="text-xl font-semibold">Recent Bookings</h2>
              </div>

              {bookingsLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading bookings...</p>
                </div>
              ) : bookingsError ? (
                <div className="text-center py-8">
                  <p className="text-red-500">{bookingsError}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No bookings yet
                    </p>
                  ) : (
                    bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="border border-gray-100 rounded-xl p-4 transition-all duration-300 hover:border-blue-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">
                            {booking.spectatorName}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-md text-xs ${
                              booking.status === "Active"
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="flex items-center gap-2">
                            <Calendar size={14} />
                            {formatDate(booking.showDate)}
                          </p>
                          <p className="flex items-center gap-2">
                            <Clock size={14} />
                            {booking.showTime || "Not specified"}
                          </p>
                          <p className="flex items-center gap-2">
                            <Ticket size={14} />
                            {booking.seatType} - Seat {booking.seatNumber}
                          </p>
                          <p className="flex items-center gap-2">
                            <Banknote size={14} />₹{booking.ticketPrice}
                          </p>
                          {booking.paymentInfo && (
                            <p className="flex items-center gap-2 text-xs text-gray-500">
                              Payment: {booking.paymentInfo}
                            </p>
                          )}
                        </div>
                        {booking.status === "Active" && (
                          <button
                            onClick={() => setSelectedBookingForCancel(booking)}
                            className="mt-3 w-full text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <XCircle size={16} />
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalespersonDashboard;
