import express from "express";
import { createShow, getShows } from "../controller/show.controller.js";

export const showRoute = express.Router();

showRoute.post("/createshow", createShow);
showRoute.post("/getShows", getShows);
