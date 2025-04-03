import React, { useState } from "react";
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
} from "lucide-react";

interface SeatCategory {
  category: "Balcony" | "Ordinary";
  totalSeats: number;
  availableSeats: number;
  price: number;
}

interface Show {
  _id: string;
  showDate: string;
  numberOfShows: number;
  timings: string[];
  seatCategories: SeatCategory[][];
  createdBy: string;
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
  bookingDate: string;
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
      return ticketPrice - 5; // Deduct Rs.5 booking charge
    } else if (daysUntilShow > 1) {
      // Deduct Rs.10 for ordinary and Rs.15 for balcony tickets
      const deduction = booking.seatType === "Balcony" ? 15 : 10;
      return ticketPrice - deduction;
    } else if (daysUntilShow >= 0) {
      return ticketPrice * 0.5; // 50% deduction on the last day
    }
    return 0; // No refund after show date
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
              Show Time: {booking.showTime}
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
              <span className="font-medium">${booking.ticketPrice}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Refund Amount:</span>
              <span className="font-medium text-green-600">
                ${refundAmount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Deduction:</span>
              <span className="font-medium text-red-600">
                ${(booking.ticketPrice - refundAmount).toFixed(2)}
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

// Mock data for demonstration
const mockShows: Show[] = [
  {
    _id: "1",
    showDate: "2024-03-20",
    numberOfShows: 2,
    timings: ["14:00", "19:00"],
    seatCategories: [
      [
        {
          category: "Balcony",
          totalSeats: 50,
          availableSeats: 45,
          price: 100,
        },
        {
          category: "Ordinary",
          totalSeats: 100,
          availableSeats: 80,
          price: 50,
        },
      ],
      [
        {
          category: "Balcony",
          totalSeats: 50,
          availableSeats: 50,
          price: 120,
        },
        {
          category: "Ordinary",
          totalSeats: 100,
          availableSeats: 90,
          price: 60,
        },
      ],
    ],
    createdBy: "user123",
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    _id: "2",
    showDate: "2024-03-21",
    numberOfShows: 1,
    timings: ["20:00"],
    seatCategories: [
      [
        {
          category: "Balcony",
          totalSeats: 50,
          availableSeats: 30,
          price: 150,
        },
        {
          category: "Ordinary",
          totalSeats: 100,
          availableSeats: 70,
          price: 75,
        },
      ],
    ],
    createdBy: "user123",
    createdAt: "2024-03-15T11:00:00Z",
  },
];

function SalespersonDashboard({ onLogout, user }) {
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

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShow) return;

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      showDate: selectedShow.show.showDate,
      showTime: selectedShow.show.timings[selectedShow.showIndex],
      seatType: bookingForm.seatType,
      seatNumber: bookingForm.seatNumber,
      spectatorName: bookingForm.spectatorName,
      ticketPrice:
        selectedShow.show.seatCategories[selectedShow.showIndex].find(
          (cat) => cat.category === bookingForm.seatType
        )?.price || 0,
      status: "Active",
      bookingDate: new Date().toISOString(),
    };

    setBookings([newBooking, ...bookings]);

    // Reset form and selected show
    setBookingForm({
      showId: "",
      showIndex: 0,
      seatType: "Ordinary",
      seatNumber: "",
      spectatorName: "",
      paymentInfo: "",
    });
    setSelectedShow(null);
  };

  const handleCancelBooking = (bookingId: string, refundAmount: number) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: "Cancelled" } : booking
      )
    );
    setSelectedBookingForCancel(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
                {mockShows.map((show) => (
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
                      {show.timings.map((timing, index) => (
                        <div
                          key={`${show._id}-${index}`}
                          className="bg-gray-50 rounded-xl p-4 transition-all duration-300 hover:bg-gray-100"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-blue-600" />
                              <span className="font-medium">{timing}</span>
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
                            {show.seatCategories[index].map((category) => (
                              <div
                                key={category.category}
                                className="flex items-center gap-2 bg-white p-2 rounded-lg"
                              >
                                <Users size={16} className="text-blue-600" />
                                <span className="flex-1">
                                  {category.category}
                                </span>
                                <span className="text-blue-600 font-medium flex items-center gap-1">
                                  <Banknote size={14} />${category.price}
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
              <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Book Tickets</h2>
                    <p className="text-sm text-gray-600">
                      {formatDate(selectedShow.show.showDate)} at{" "}
                      {selectedShow.show.timings[selectedShow.showIndex]}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedShow(null)}
                    className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Seat Type
                    </label>
                    <select
                      value={bookingForm.seatType}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          seatType: e.target.value as "Balcony" | "Ordinary",
                        })
                      }
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-300"
                      required
                    >
                      {selectedShow.show.seatCategories[
                        selectedShow.showIndex
                      ].map((category) => (
                        <option
                          key={category.category}
                          value={category.category}
                        >
                          {category.category} (${category.price}) -{" "}
                          {category.availableSeats} available
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-300"
                      placeholder="Enter seat number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-300"
                      placeholder="Enter spectator name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-300"
                      placeholder="Enter payment information"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    Confirm Booking
                  </button>
                </form>
              </div>
            )}

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <History size={24} className="text-blue-600" />
                <h2 className="text-xl font-semibold">Recent Bookings</h2>
              </div>
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
                        <h3 className="font-medium">{booking.spectatorName}</h3>
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
                          {booking.showTime}
                        </p>
                        <p className="flex items-center gap-2">
                          <Ticket size={14} />
                          {booking.seatType} - Seat {booking.seatNumber}
                        </p>
                        <p className="flex items-center gap-2">
                          <Banknote size={14} />${booking.ticketPrice}
                        </p>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalespersonDashboard;
