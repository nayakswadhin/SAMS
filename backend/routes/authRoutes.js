import express from "express";
import {
  getAllSalesPerson,
  login,
  register,
} from "../controller/user.controller.js";

export const authRoute = express.Router();

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.post("/salesperson", getAllSalesPerson);
