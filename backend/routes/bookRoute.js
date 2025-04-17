import express from "express";
import {
  cancelBooking,
  createBooking,
  getBookings,
  getSalesData,
} from "../controller/book.controller.js";

export const bookRoute = express.Router();

bookRoute.post("/book-seat", createBooking);
bookRoute.post("/getBookings", getBookings);
bookRoute.post("/cancelBooking", cancelBooking);
bookRoute.post("/getCommission", getSalesData);
