import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  CreditCard,
  Ticket,
  Award,
  Calendar,
  Clock,
  X,
} from "lucide-react";

interface SalesMetrics {
  totalTickets: number;
  activeTickets: number;
  cancelledTickets: number;
  balconyTickets: number;
  ordinaryTickets: number;
  totalSalesAmount: number;
  commission: string;
}

interface Sale {
  spectator: {
    name: string;
    paymentInfo: string;
  };
  _id: string;
  show: {
    _id: string;
    showDate: string;
  };
  seatType: string;
  seatNumber: string;
  ticketPrice: number;
  status: string;
  showTime: string;
  bookingDate: string;
  cancellation?: {
    cancellationDate: string;
    refundAmount: number;
  };
}

interface CommissionData {
  salespersonId: string;
  salesMetrics: SalesMetrics;
  allSales: Sale[];
}

interface SalespersonDetails {
  _id: string;
  name: string;
  designation: string;
  address: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
}

interface SalespersonDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  salesperson: SalespersonDetails;
}

const SalespersonDetailsModal: React.FC<SalespersonDetailsModalProps> = ({
  isOpen,
  onClose,
  salesperson,
}) => {
  const [commissionData, setCommissionData] = useState<CommissionData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommissionData = async () => {
      if (!isOpen) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.post(
          "https://sams-backend-tbjv.onrender.com/getCommission",
          {
            salespersonId: salesperson._id,
          }
        );

        setCommissionData(response.data.data);
      } catch (err) {
        setError("No sales Found");
        console.error("Error fetching commission data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommissionData();
  }, [isOpen, salesperson._id]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 relative">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <h3 className="text-2xl font-semibold">{salesperson.name}</h3>
              <div className="flex items-center gap-2 mt-2 text-blue-100">
                <Award size={16} />
                <p>Salesperson</p>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm text-blue-100">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>
                    Joined{" "}
                    {new Date(salesperson.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>Active</span>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="p-6 space-y-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading sales data...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-600">
                    <p>{error}</p>
                  </div>
                ) : (
                  commissionData && (
                    <>
                      {/* Personal Information */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gray-50 rounded-xl p-6"
                      >
                        <h4 className="text-lg font-semibold mb-4 text-gray-800">
                          Contact Information
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-gray-700">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Phone size={20} className="text-blue-600" />
                            </div>
                            <span>{salesperson.phoneNumber}</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-700">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Mail size={20} className="text-blue-600" />
                            </div>
                            <span>{salesperson.email}</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-700">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <MapPin size={20} className="text-blue-600" />
                            </div>
                            <span>{salesperson.address}</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Sales Statistics */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-blue-500 p-2 rounded-lg">
                              <TrendingUp className="text-white" size={24} />
                            </div>
                            <h4 className="font-semibold text-blue-900">
                              Total Sales
                            </h4>
                          </div>
                          <p className="text-3xl font-bold text-blue-700">
                            {commissionData.salesMetrics.totalTickets}
                            <span className="text-lg text-blue-600 ml-1">
                              tickets
                            </span>
                          </p>
                          <p className="text-sm text-blue-600 mt-2">
                            Active: {commissionData.salesMetrics.activeTickets}{" "}
                            | Cancelled:{" "}
                            {commissionData.salesMetrics.cancelledTickets}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-green-500 p-2 rounded-lg">
                              <CreditCard className="text-white" size={24} />
                            </div>
                            <h4 className="font-semibold text-green-900">
                              Commission
                            </h4>
                          </div>
                          <p className="text-3xl font-bold text-green-700">
                            ₹
                            {parseFloat(
                              commissionData.salesMetrics.commission
                            ).toLocaleString()}
                          </p>
                          <p className="text-sm text-green-600 mt-2">
                            Total Sales: ₹
                            {commissionData.salesMetrics.totalSalesAmount.toLocaleString()}
                          </p>
                        </div>
                      </motion.div>

                      {/* Seat Category Breakdown */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm"
                      >
                        <h4 className="font-semibold text-gray-800 mb-4">
                          Sales by Seat Category
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="bg-purple-500 p-2 rounded-lg">
                                <Ticket className="text-white" size={20} />
                              </div>
                              <h5 className="font-medium text-purple-900">
                                Ordinary
                              </h5>
                            </div>
                            <p className="text-2xl font-bold text-purple-700">
                              {commissionData.salesMetrics.ordinaryTickets}
                              <span className="text-sm text-purple-600 ml-1">
                                tickets
                              </span>
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="bg-indigo-500 p-2 rounded-lg">
                                <Ticket className="text-white" size={20} />
                              </div>
                              <h5 className="font-medium text-indigo-900">
                                Balcony
                              </h5>
                            </div>
                            <p className="text-2xl font-bold text-indigo-700">
                              {commissionData.salesMetrics.balconyTickets}
                              <span className="text-sm text-indigo-600 ml-1">
                                tickets
                              </span>
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Recent Sales */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm"
                      >
                        <h4 className="font-semibold text-gray-800 mb-4">
                          Recent Sales
                        </h4>
                        <div className="space-y-4">
                          {commissionData.allSales.map((sale) => (
                            <div
                              key={sale._id}
                              className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h5 className="font-medium text-gray-900">
                                    {sale.spectator.name}
                                  </h5>
                                  <p className="text-sm text-gray-600">
                                    {sale.seatType} - Seat {sale.seatNumber}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      sale.status === "Active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {sale.status}
                                  </span>
                                </div>
                              </div>
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>₹{sale.ticketPrice}</span>
                                <span>
                                  {new Date(
                                    sale.bookingDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              {sale.cancellation && (
                                <div className="mt-2 text-sm text-red-600">
                                  Cancelled:{" "}
                                  {new Date(
                                    sale.cancellation.cancellationDate
                                  ).toLocaleDateString()}
                                  (Refund: ₹{sale.cancellation.refundAmount})
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 bg-gray-50">
              <button
                onClick={onClose}
                className="w-full bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SalespersonDetailsModal;
