import { useState, useEffect } from "react";
import {
  Users,
  Building2,
  Calendar,
  Clock,
  IndianRupee,
  Users as SeatsIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Modal from "./Modal";
import CreateSalespersonForm from "./CreateSalespersonForm";
import AddShowForm from "./AddShowForm";
import SalespersonCard from "./SalesPersonCard";

interface SeatCategory {
  category: "Balcony" | "Ordinary";
  totalSeats: number;
  availableSeats: number;
  price: number;
}

interface ShowTiming {
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

interface Salesperson {
  _id: string;
  name: string;
  designation: string;
  address: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
}

export default function ManagerDashboard({ onLogout, user }) {
  const [isSalespersonModalOpen, setIsSalespersonModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [shows, setShows] = useState<Show[]>([]);
  const [salespersons, setSalespersons] = useState<Salesperson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedShow, setExpandedShow] = useState<string | null>(null);
  const manager = JSON.parse(localStorage.getItem("user"));
  const managerId = manager._id;

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const res = await axios.post(
          "https://sams-backend-tbjv.onrender.com/getShows",
          {
            managerId: managerId,
          }
        );
        console.log(res.data);
        setShows(res.data.shows || []);
      } catch (e) {
        console.log(e);
        setShows([]);
      }
    };
    const fetchSalespersons = async () => {
      try {
        await axios
          .post("https://sams-backend-tbjv.onrender.com/api/salesperson", {
            managerId: managerId,
          })
          .then((res) => {
            console.log(res);
            setSalespersons(res.data.user);
          })
          .catch((e) => {
            console.log(e);
          });
      } catch (err) {
        setError("Failed to fetch salespersons");
        console.error("Error fetching salespersons:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalespersons();
    fetchShows();
  }, []);

  const handleCreateSalesperson = (data: any) => {
    console.log("Creating salesperson:", data);
    setIsSalespersonModalOpen(false);
  };

  const handleCreateShow = async (data: any) => {
    console.log("Creating show:", data);

    try {
      const showData = {
        showDate: data.showDate,
        numberOfShows: data.numberOfShows,
        shows: data.shows,
        managerId: managerId,
      };

      const response = await fetch(
        "https://sams-backend-tbjv.onrender.com/createshow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(showData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("Show created successfully:", result);
        setShows((prev) => [...prev, result.data]);
      } else {
        console.error("Failed to create show:", result);
      }
    } catch (error) {
      console.error("Error creating show:", error);
    } finally {
      setIsShowModalOpen(false);
    }
  };

  const toggleShowExpansion = (showId: string) => {
    setExpandedShow(expandedShow === showId ? null : showId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-lg backdrop-blur-md bg-opacity-90 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ rotate: -20 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Building2 size={32} className="text-blue-600" />
              </motion.div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
                SAMS Dashboard
              </h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium"
            >
              Logout
            </motion.button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-8 backdrop-blur-md bg-opacity-90"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Welcome, {user?.name}!
          </h2>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSalespersonModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 shadow-md hover:shadow-lg"
            >
              <Users size={20} />
              Create Salesperson
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsShowModalOpen(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 shadow-md hover:shadow-lg"
            >
              <Calendar size={20} />
              Add Show
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-8 backdrop-blur-md bg-opacity-90"
        >
          <h3 className="text-xl font-semibold mb-6 text-gray-800">
            Your Salespersons
          </h3>
          {isLoading ? (
            <div className="text-center py-6 text-gray-600">
              Loading salespersons...
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-6">{error}</div>
          ) : salespersons.length === 0 ? (
            <div className="text-center text-gray-600 py-6">
              No salespersons found. Create one to get started!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {salespersons.map((salesperson) => (
                <SalespersonCard
                  key={salesperson._id}
                  salesperson={salesperson}
                />
              ))}
            </div>
          )}
        </motion.div>

        {shows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-8 backdrop-blur-md bg-opacity-90"
          >
            <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-3">
              <Calendar className="text-blue-600" />
              Upcoming Shows
            </h3>
            <div className="space-y-6">
              <AnimatePresence>
                {shows.map((show) => (
                  <motion.div
                    key={show._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
                  >
                    <div
                      className="flex justify-between items-start cursor-pointer"
                      onClick={() => toggleShowExpansion(show._id)}
                    >
                      <div className="space-y-2">
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                          <Calendar className="text-blue-600" size={20} />
                          {new Date(show.showDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </h4>
                        <p className="text-gray-600 flex items-center gap-2">
                          <Clock size={18} className="text-green-600" />
                          Number of Shows: {show.numberOfShows}
                        </p>
                      </div>
                      <motion.div
                        animate={{
                          rotate: expandedShow === show._id ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="text-gray-500" />
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {expandedShow === show._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-6 space-y-4"
                        >
                          {show.shows &&
                            show.shows.map((showTiming, showIndex) => (
                              <motion.div
                                key={showIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: showIndex * 0.1 }}
                                className="bg-gray-50 p-6 rounded-xl border border-gray-100"
                              >
                                <h5 className="font-medium mb-4 flex items-center gap-2 text-gray-800">
                                  <Clock className="text-blue-600" size={18} />
                                  Show #{showIndex + 1} - {showTiming.timing}
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {showTiming.seatCategories.map(
                                    (category, i) => (
                                      <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                                      >
                                        <h6 className="font-medium text-gray-800 mb-2">
                                          {category.category}
                                        </h6>
                                        <div className="space-y-2">
                                          <p className="text-sm text-gray-600 flex items-center gap-2">
                                            <SeatsIcon
                                              size={16}
                                              className="text-green-600"
                                            />
                                            Available: {category.availableSeats}{" "}
                                            / {category.totalSeats}
                                          </p>
                                          <p className="text-sm text-gray-600 flex items-center gap-2">
                                            <IndianRupee
                                              size={16}
                                              className="text-blue-600"
                                            />
                                            Price: ₹{category.price}
                                          </p>
                                        </div>
                                      </motion.div>
                                    )
                                  )}
                                </div>
                              </motion.div>
                            ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>

      <Modal
        isOpen={isSalespersonModalOpen}
        onClose={() => setIsSalespersonModalOpen(false)}
      >
        <CreateSalespersonForm onSubmit={handleCreateSalesperson} />
      </Modal>

      <Modal isOpen={isShowModalOpen} onClose={() => setIsShowModalOpen(false)}>
        <AddShowForm
          onSubmit={handleCreateShow}
          onClose={() => setIsShowModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
