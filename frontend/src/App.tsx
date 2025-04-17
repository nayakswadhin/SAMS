import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import LandingPage from "./components/LandingPage";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ManagerDashboard from "./components/ManagerDashBoard";
import SalespersonDashboard from "./components/SalesPersonDashBoard";

interface User {
  name: string;
  designation: string;
  address: string;
  email: string;
  phoneNumber: string;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"manager" | "salesperson" | null>(
    null
  );
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedUserType = localStorage.getItem("userType");
    if (storedUser && storedUserType) {
      setUser(JSON.parse(storedUser));
      setUserType(storedUserType as "manager" | "salesperson");
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginClick = (type: "manager" | "salesperson") => {
    setUserType(type);
    setShowLogin(true);
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log("Attempting login with:", email);

      const response = await axios.post(
        "https://sams-backend-tbjv.onrender.com/api/login",
        {
          email,
          password,
        }
      );
      console.log("Login successful");
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("userType", userType!);
      setUser(response.data.user);
      setIsLoggedIn(true);
      setShowLogin(false);
      toast.success(response.data.message);
    } catch (error: any) {
      console.error("Error during login request:", error);
      if (error.response) {
        toast.error(
          error.response.data.message || "An error occurred during login"
        );
      } else {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      }
    }
  };

  const handleSignup = async (data: {
    name: string;
    designation: string;
    address: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    try {
      const response = await axios.post(
        "https://sams-backend-tbjv.onrender.com/api/register",
        data
      );
      console.log("Signup successful");
      localStorage.setItem("user", JSON.stringify(response.data.data));
      localStorage.setItem("userType", "manager");
      setUser(response.data.data);
      setShowSignup(false);
      setIsLoggedIn(true);
      setShowLogin(false);
      toast.success(response.data.message);
    } catch (error: any) {
      console.error("Error during signup request:", error);
      if (error.response) {
        toast.error(
          error.response.data.message || "An error occurred during signup"
        );
      } else {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      }
    }
  };

  const handleLogout = () => {
    // Clear localStorage on logout
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    setUser(null);
    setIsLoggedIn(false);
    setUserType(null);
    setShowLogin(false);
    setShowSignup(false);
    toast.success("Logged out successfully");
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 2000,
            theme: {
              primary: "#4aed88",
            },
          },
          error: {
            duration: 2000,
            theme: {
              primary: "#ff4b4b",
            },
          },
        }}
      />

      {showSignup && userType === "manager" ? (
        <SignupForm
          onSignup={handleSignup}
          onBack={() => setShowSignup(false)}
          onLoginClick={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      ) : showLogin ? (
        <LoginForm
          userType={userType!}
          onLogin={handleLogin}
          onBack={() => {
            setShowLogin(false);
            setUserType(null);
          }}
          onSignupClick={
            userType === "manager"
              ? () => {
                  setShowLogin(false);
                  setShowSignup(true);
                }
              : undefined
          }
        />
      ) : isLoggedIn ? (
        userType === "manager" ? (
          <ManagerDashboard user={user} onLogout={handleLogout} />
        ) : (
          <SalespersonDashboard user={user} onLogout={handleLogout} />
        )
      ) : (
        <LandingPage onLoginClick={handleLoginClick} />
      )}
    </>
  );
}

export default App;
