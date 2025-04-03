import express from "express";
import { createShow } from "../controller/show.controller.js";

export const showRoute = express.Router();

showRoute.post("/createshow", createShow);
