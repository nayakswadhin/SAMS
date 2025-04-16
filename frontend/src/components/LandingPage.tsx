import { Users, UserCircle, Building2 } from "lucide-react";
import { motion } from "framer-motion";

interface LandingPageProps {
  onLoginClick: (type: "manager" | "salesperson") => void;
}

export default function LandingPage({ onLoginClick }: LandingPageProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1579975096649-e773152b04cb?q=80&w=2940')] bg-cover bg-center">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/90 to-blue-900/90 backdrop-blur-sm"></div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl w-full relative z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-block p-4 rounded-full bg-blue-500/20 backdrop-blur-sm mb-4">
            <Building2 size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Student Auditorium Management System
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Streamline your auditorium bookings, manage events, and handle
            operations efficiently with our comprehensive management solution
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl hover:bg-white/15 transition-all duration-300"
          >
            <div className="space-y-6">
              <div className="p-3 bg-blue-500/20 rounded-full w-fit">
                <UserCircle size={32} className="text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white">Venue Manager</h2>
                <p className="text-blue-100">
                  Take control of your auditorium operations. Manage bookings,
                  oversee events, and track performance metrics.
                </p>
                <ul className="space-y-3 text-blue-100">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Event scheduling and coordination
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Resource allocation management
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Analytics and reporting tools
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onLoginClick("manager")}
                className="w-full flex justify-center items-center py-3 px-6 rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                <UserCircle size={20} className="mr-2" />
                Login as Manager
              </button>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl hover:bg-white/15 transition-all duration-300"
          >
            <div className="space-y-6">
              <div className="p-3 bg-purple-500/20 rounded-full w-fit">
                <Users size={32} className="text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white">
                  Sales Personnel
                </h2>
                <p className="text-blue-100">
                  Handle bookings and customer inquiries efficiently. Manage
                  reservations and client communications.
                </p>
                <ul className="space-y-3 text-blue-100">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Booking management system
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Client communication tools
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Schedule visualization
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onLoginClick("salesperson")}
                className="w-full flex justify-center items-center py-3 px-6 rounded-lg text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                <Users size={20} className="mr-2" />
                Login as Sales Personnel
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mt-12 text-center">
          <p className="text-blue-100 text-sm">
            © 2025 Student Auditorium Management System. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
