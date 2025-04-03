import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import { authRoute } from "./routes/authRoutes.js";
import { showRoute } from "./routes/showRoute.js";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

try {
  await mongoose.connect(
    "mongodb+srv://swadhinkuumar07:123@cluster0.spblafg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("Mongodb connected sucessfully!!");
} catch (error) {
  console.log("error in connecting to the database!!");
}
app.get("/", (req, res) => {
  return res.status(200).json({ message: "Health is Good!!" });
});

app.use("/api", authRoute);
app.use("/", showRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
