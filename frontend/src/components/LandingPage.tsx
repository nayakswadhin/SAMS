import { Users, UserCircle, Building2 } from "lucide-react";

interface LandingPageProps {
  onLoginClick: (type: "manager" | "salesperson") => void;
}

export default function LandingPage({ onLoginClick }: LandingPageProps) {
  return (
    <div className="min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden md:flex animate-fadeIn">
            <div className="md:w-1/2 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Building2 size={32} className="text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-800">SAMS</h1>
              </div>
              <p className="text-gray-600 mb-8 text-lg">
                Student Auditorium Management System - Your complete solution
                for venue management and booking
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => onLoginClick("manager")}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 flex items-center justify-center gap-2 transform hover:scale-105 hover:shadow-xl"
                >
                  <UserCircle size={24} />
                  Login as Manager
                </button>
                <button
                  onClick={() => onLoginClick("salesperson")}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-purple-800 transition duration-300 flex items-center justify-center gap-2 transform hover:scale-105 hover:shadow-xl"
                >
                  <Users size={24} />
                  Login as Salesperson
                </button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <img
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
                alt="Auditorium"
                className="object-cover h-full w-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-white text-center p-6 transform hover:scale-105 transition-transform duration-300">
                  <h2 className="text-3xl font-bold mb-3">
                    Streamline Your Venue
                  </h2>
                  <p className="text-lg">
                    Efficiently manage bookings and sales with our comprehensive
                    system
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
