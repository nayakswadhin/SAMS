import { User } from "../models/User.model.js";

export const register = async (req, res) => {
  const { managerId, name, designation, address, email, phone, password } =
    req.body;
  if (!name || !designation || !address || !email || !phone || !password) {
    return res.status(400).json({ message: "Some parameters are missing!" });
  }

  if (designation === "SalesUser" && !managerId) {
    return res
      .status(400)
      .json({ message: "Manager ID is required for SalesUser!" });
  }

  if (designation === "SalesUser" && managerId) {
    const manager = await User.findById(managerId);
    if (!manager || manager.designation !== "Manager") {
      return res.status(400).json({
        message:
          "Invalid manager ID. The assigned manager must exist and be a Manager.",
      });
    }
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exists. Try a different email!" });
  }
  const user = new User({
    name,
    designation,
    address,
    email,
    phoneNumber: phone,
    password,
    managerId: designation === "SalesUser" ? managerId : undefined, // Only set if SalesUser
  });

  try {
    const savedUser = await user.save();
    console.log("User created:", savedUser);
    return res
      .status(201)
      .json({ message: "User created successfully", data: savedUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Error creating user", error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const person = await User.findOne({ email });
    if (!person) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await person.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Login successful:", person.name);
    return res
      .status(200)
      .json({ message: "Sucessfully Logged In", user: person });
  } catch (error) {
    console.error("Login error:", error.message);
    return res
      .status(500)
      .json({ message: "Error in logging", error: error.message });
  }
};

export const getAllSalesPerson = async (req, res) => {
  const { managerId } = req.body;
  const salesPerson = await User.find({
    designation: "SalesUser",
    managerId: managerId,
  });
  if (!salesPerson) {
    return res.status(400).json({ message: "No sales person found" });
  }
  return res
    .status(200)
    .json({ message: "sales person found", user: salesPerson });
};
