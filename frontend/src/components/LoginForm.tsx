import { useState } from "react";
import { ArrowLeft, LogIn, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface LoginFormProps {
  userType: "manager" | "salesperson";
  onLogin: (email: string, password: string) => Promise<void>;
  onBack: () => void;
  onSignupClick?: () => void;
}

export default function LoginForm({
  userType,
  onLogin,
  onBack,
  onSignupClick,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2940')] bg-cover bg-center">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/80 to-blue-900/80 backdrop-blur-sm"></div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-5xl w-full bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl relative grid grid-cols-2 gap-8"
      >
        {/* Left Column - Form */}
        <div className="space-y-6">
          <motion.button
            variants={itemVariants}
            onClick={onBack}
            className="flex items-center text-white hover:text-blue-200 transition-colors hover:-translate-x-1 transform transition-transform duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </motion.button>

          <motion.div variants={itemVariants} className="text-center space-y-2">
            <div className="inline-block p-3 rounded-full bg-blue-500/20 backdrop-blur-sm mb-2">
              <LogIn size={24} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-blue-100">
              Sign in as {userType === "manager" ? "Manager" : "Salesperson"}
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants} className="relative">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white mb-1"
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-300"
                  placeholder="chirag@example.com"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-300"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-[1.02]"
              >
                <LogIn size={20} className="mr-2" />
                Sign in
              </button>
            </motion.div>
          </form>

          {userType === "manager" && onSignupClick && (
            <motion.div variants={itemVariants} className="text-center mt-4">
              <p className="text-sm text-blue-100">
                Don't have an account?{" "}
                <button
                  onClick={onSignupClick}
                  className="font-medium text-blue-300 hover:text-blue-200 transition-colors duration-200 underline"
                >
                  Sign up
                </button>
              </p>
            </motion.div>
          )}
        </div>

        {/* Right Column - Content */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col justify-center items-center text-center text-white space-y-6"
        >
          <div className="space-y-4">
            <h3 className="text-4xl font-bold">Welcome Back!</h3>
            <p className="text-lg text-blue-100">
              {userType === "manager"
                ? "Access your management dashboard and take control of your business operations."
                : "Access your sales dashboard and manage your daily activities efficiently."}
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-blue-100">
                "Streamline your workflow and boost productivity with our
                comprehensive management tools."
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
