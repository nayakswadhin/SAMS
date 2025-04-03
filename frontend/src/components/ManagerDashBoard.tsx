import { useState, useEffect } from "react";
import { Users, Building2, Calendar } from "lucide-react";
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

interface ShowData {
  timing: string;
  seatCategories: SeatCategory[];
}

interface Show {
  showDate: string;
  numberOfShows: number;
  shows: ShowData[];
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

  useEffect(() => {
    const fetchSalespersons = async () => {
      try {
        const manager = JSON.parse(localStorage.getItem("user"));
        await axios
          .post("http://localhost:3000/api/salesperson", {
            managerId: manager._id,
          })
          .then((res) => {
            console.log(res);
            setSalespersons(res.data.user);
          })
          .catch((e) => {
            console.log(e);
          });

        // if (response.data.message === "sales person found") {
        // }
      } catch (err) {
        setError("Failed to fetch salespersons");
        console.error("Error fetching salespersons:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalespersons();
  }, []);

  const handleCreateSalesperson = (data: any) => {
    console.log("Creating salesperson:", data);
    setIsSalespersonModalOpen(false);
  };

  const handleCreateShow = async (data: any) => {
    console.log("Creating show:", data);

    try {
      // Transform the data to match what the backend expects
      const transformedData = {
        showDate: data.showDate,
        numberOfShows: data.numberOfShows,
        timings: data.shows.map((show: any) => show.timing),
        seatCategories: data.shows[0].seatCategories,
        // If you have managerId, include it
        // managerId: yourManagerId
      };

      // Send data to the API
      const response = await fetch("http://localhost/api/createshow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include authentication token if needed
          // 'Authorization': `Bearer ${yourAuthToken}`
        },
        body: JSON.stringify(transformedData),
      });

      const result = await response.json();

      if (response.ok) {
        // Success - update local state with the newly created show
        setShows((prev) => [...prev, result.data]); // Use the data from API response
        console.log("Show created successfully:", result);
        // toast.success("Show created successfully");
      } else {
        // Error handling
        console.error("Failed to create show:", result);
        // toast.error(result.message || "Failed to create show");
      }
    } catch (error) {
      console.error("Error creating show:", error);
      // toast.error("Network error. Please try again.");
    } finally {
      setIsShowModalOpen(false);
      setShows((prev) => [...prev, data]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Building2 size={28} className="text-blue-600" />
              <h1 className="text-2xl font-bold text-blue-600">
                SAMS Dashboard
              </h1>
            </div>
            <button
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Welcome, {user?.name}!</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setIsSalespersonModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center gap-2 transform hover:scale-105"
            >
              <Users size={20} />
              Create Salesperson
            </button>
            <button
              onClick={() => setIsShowModalOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 flex items-center gap-2 transform hover:scale-105"
            >
              <Calendar size={20} />
              Add Show
            </button>
          </div>
        </div>

        {/* Salespersons Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Your Salespersons</h3>
          {isLoading ? (
            <div className="text-center py-4">Loading salespersons...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-4">{error}</div>
          ) : salespersons.length === 0 ? (
            <div className="text-center text-gray-600 py-4">
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
        </div>

        {/* Shows Section */}
        {shows.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Shows</h3>
            <div className="space-y-4">
              {shows.map((show, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">
                        Date: {new Date(show.showDate).toLocaleDateString()}
                      </h4>
                      <p className="text-gray-600">
                        Number of Shows: {show.numberOfShows}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {show.shows.map((showData, showIndex) => (
                      <div
                        key={showIndex}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <h5 className="font-medium mb-3">
                          Show #{showIndex + 1}
                        </h5>
                        <p className="text-gray-600 mb-2">
                          Time: {showData.timing}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {showData.seatCategories.map((category, i) => (
                            <div
                              key={i}
                              className="bg-white p-3 rounded-lg shadow-sm"
                            >
                              <h6 className="font-medium">
                                {category.category}
                              </h6>
                              <p className="text-sm text-gray-600">
                                Available: {category.availableSeats} /{" "}
                                {category.totalSeats}
                              </p>
                              <p className="text-sm text-gray-600">
                                Price: ₹{category.price}
                              </p>
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
