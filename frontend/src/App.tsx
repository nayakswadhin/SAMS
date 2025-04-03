import { useState, useEffect } from "react";
import axios from "axios";
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
    // Check if user data exists in localStorage on component mount
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

      const response = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });

      if (response.data.message === "Sucessfully Logged In") {
        console.log("Login successful");
        // Store user data and type in localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("userType", userType!);
        setUser(response.data.user);
        setIsLoggedIn(true);
        setShowLogin(false);
        console.log(response.data);
      } else {
        console.error("Login failed:", response.data.error);
        // Handle login failure (e.g., show error message to user)
      }
    } catch (error) {
      console.error("Error during login request:", error);
      // Handle network errors or other exceptions
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
        "http://localhost:3000/api/register",
        data
      );

      if (response.data.message === "User Created Sucessfully") {
        console.log("Signup successful");
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(response.data.data));
        localStorage.setItem("userType", "manager"); // Since only managers can sign up
        setUser(response.data.data);
        setShowSignup(false);
        setShowLogin(true);
        console.log(response.data);
      } else {
        console.error("Signup failed:", response.data.error);
        // Handle signup failure
      }
    } catch (error) {
      console.error("Error during signup request:", error);
      // Handle network errors or other exceptions
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
  };

  if (showSignup && userType === "manager") {
    return (
      <SignupForm
        onSignup={handleSignup}
        onBack={() => setShowSignup(false)}
        onLoginClick={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    );
  }

  if (showLogin) {
    return (
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
    );
  }

  if (isLoggedIn) {
    return userType === "manager" ? (
      <ManagerDashboard user={user} onLogout={handleLogout} />
    ) : (
      <SalespersonDashboard user={user} onLogout={handleLogout} />
    );
  }

  return <LandingPage onLoginClick={handleLoginClick} />;
}

export default App;
