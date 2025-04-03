import { useState, useEffect } from "react";
import { X } from "lucide-react";

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
      // Add new shows
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
      // Remove excess shows
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
    <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Add New Show</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Show Date
            </label>
            <input
              type="date"
              value={formData.showDate}
              onChange={(e) =>
                setFormData(
                  (prev: ShowFormData): ShowFormData => ({
                    ...prev,
                    showDate: e.target.value,
                  })
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Shows
            </label>
            <input
              type="number"
              min="1"
              value={formData.numberOfShows}
              onChange={(e) =>
                setFormData(
                  (prev: ShowFormData): ShowFormData => ({
                    ...prev,
                    numberOfShows: parseInt(e.target.value) || 1,
                  })
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          {formData.shows.map((show, showIndex) => (
            <div
              key={showIndex}
              className="border border-gray-200 rounded-lg p-4"
            >
              <h3 className="text-lg font-semibold mb-4">
                Show #{showIndex + 1}
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Show Timing
                </label>
                <input
                  type="time"
                  value={show.timing}
                  onChange={(e) => updateShowTiming(showIndex, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Seat Categories</h4>
                {show.seatCategories.map((category, categoryIndex) => (
                  <div
                    key={categoryIndex}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <h5 className="font-semibold mb-3">{category.category}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Total Seats
                        </label>
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Available Seats
                        </label>
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Price
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={category.price}
                          onChange={(e) =>
                            updateSeatCategory(showIndex, categoryIndex, {
                              price: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Create Show
          </button>
        </div>
      </form>
    </div>
  );
}
