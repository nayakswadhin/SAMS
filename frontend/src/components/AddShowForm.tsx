import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  Users,
  IndianRupee,
  Plus,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SeatCategory {
  category: "Balcony" | "Ordinary";
  totalSeats: number;
  availableSeats: number;
  price: number;
}

interface ShowData {
  timing: string;
  seatCategories: SeatCategory[];
}

interface ShowFormData {
  showDate: string;
  numberOfShows: number;
  shows: ShowData[];
}

interface AddShowFormProps {
  onSubmit: (data: ShowFormData) => void;
  onClose: () => void;
}

const defaultSeatCategories: SeatCategory[] = [
  {
    category: "Balcony",
    totalSeats: 0,
    availableSeats: 0,
    price: 0,
  },
  {
    category: "Ordinary",
    totalSeats: 0,
    availableSeats: 0,
    price: 0,
  },
];

const createDefaultShow = (): ShowData => ({
  timing: "",
  seatCategories: [...defaultSeatCategories],
});

export default function AddShowForm({ onSubmit, onClose }: AddShowFormProps) {
  const [formData, setFormData] = useState<ShowFormData>({
    showDate: "",
    numberOfShows: 1,
    shows: [createDefaultShow()],
  });

  useEffect(() => {
    const currentShows = formData.shows.length;
    const targetShows = formData.numberOfShows;

    if (currentShows < targetShows) {
      const newShows = Array.from(
        { length: targetShows - currentShows },
        createDefaultShow
      );

      setFormData(
        (prev: ShowFormData): ShowFormData => ({
          ...prev,
          shows: [...prev.shows, ...newShows],
        })
      );
    } else if (currentShows > targetShows) {
      setFormData(
        (prev: ShowFormData): ShowFormData => ({
          ...prev,
          shows: prev.shows.slice(0, targetShows),
        })
      );
    }
  }, [formData.numberOfShows]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateShowTiming = (showIndex: number, timing: string) => {
    setFormData(
      (prev: ShowFormData): ShowFormData => ({
        ...prev,
        shows: prev.shows.map((show, i) =>
          i === showIndex ? { ...show, timing } : show
        ),
      })
    );
  };

  const updateSeatCategory = (
    showIndex: number,
    categoryIndex: number,
    updates: Partial<SeatCategory>
  ) => {
    setFormData(
      (prev: ShowFormData): ShowFormData => ({
        ...prev,
        shows: prev.shows.map((show, i) =>
          i === showIndex
            ? {
                ...show,
                seatCategories: show.seatCategories.map((category, j) =>
                  j === categoryIndex ? { ...category, ...updates } : category
                ),
              }
            : show
        ),
      })
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl p-6 max-w-4xl w-full shadow-xl"
    >
      <div className="flex justify-between items-center mb-8">
        <motion.h2
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text flex items-center gap-3"
        >
          <Calendar className="text-blue-600" />
          Add New Show
        </motion.h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Show Date
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="date"
                value={formData.showDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    showDate: e.target.value,
                  }))
                }
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Number of Shows
            </label>
            <div className="relative">
              <Plus
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="number"
                min="1"
                value={formData.numberOfShows}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    numberOfShows: parseInt(e.target.value) || 1,
                  }))
                }
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          <AnimatePresence>
            {formData.shows.map((show, showIndex) => (
              <motion.div
                key={showIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: showIndex * 0.1 }}
                className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-gray-50 to-white shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
                  <Clock className="text-blue-600" size={20} />
                  Show #{showIndex + 1}
                </h3>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Show Timing
                  </label>
                  <div className="relative">
                    <Clock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="time"
                      value={show.timing}
                      onChange={(e) =>
                        updateShowTiming(showIndex, e.target.value)
                      }
                      className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700 flex items-center gap-2">
                    <Users className="text-blue-600" size={18} />
                    Seat Categories
                  </h4>
                  {show.seatCategories.map((category, categoryIndex) => (
                    <motion.div
                      key={categoryIndex}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                    >
                      <h5 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <ChevronDown className="text-blue-600" size={18} />
                        {category.category}
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm text-gray-600">
                            Total Seats
                          </label>
                          <div className="relative">
                            <Users
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={16}
                            />
                            <input
                              type="number"
                              min="0"
                              value={category.totalSeats}
                              onChange={(e) => {
                                const totalSeats = parseInt(e.target.value);
                                updateSeatCategory(showIndex, categoryIndex, {
                                  totalSeats,
                                  availableSeats: totalSeats,
                                });
                              }}
                              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm text-gray-600">
                            Available Seats
                          </label>
                          <div className="relative">
                            <Users
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={16}
                            />
                            <input
                              type="number"
                              min="0"
                              max={category.totalSeats}
                              value={category.availableSeats}
                              onChange={(e) =>
                                updateSeatCategory(showIndex, categoryIndex, {
                                  availableSeats: parseInt(e.target.value),
                                })
                              }
                              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm text-gray-600">
                            Price
                          </label>
                          <div className="relative">
                            <IndianRupee
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={16}
                            />
                            <input
                              type="number"
                              min="0"
                              value={category.price}
                              onChange={(e) =>
                                updateSeatCategory(showIndex, categoryIndex, {
                                  price: parseInt(e.target.value),
                                })
                              }
                              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <Plus size={20} />
            Create Show
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
}
