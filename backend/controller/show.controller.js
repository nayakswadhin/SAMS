import { Show } from "../models/Show.model.js";

export const createShow = async (req, res) => {
  try {
    const { showDate, numberOfShows, shows, managerId } = req.body;
    if (!showDate || !numberOfShows || !shows || !shows.length) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    if (shows.length !== numberOfShows) {
      return res.status(400).json({
        success: false,
        message: `Number of shows (${shows.length}) does not match numberOfShows (${numberOfShows})`,
      });
    }
    for (const show of shows) {
      if (!show.timing) {
        return res.status(400).json({
          success: false,
          message: "Each show must include timing",
        });
      }

      if (!show.seatCategories || !show.seatCategories.length) {
        return res.status(400).json({
          success: false,
          message: "Each show must include seat categories",
        });
      }
      for (const category of show.seatCategories) {
        if (!category.category || !category.totalSeats || !category.price) {
          return res.status(400).json({
            success: false,
            message:
              "Each seat category must include category, totalSeats, and price",
          });
        }
        category.availableSeats = category.totalSeats;
      }
    }
    const show = await Show.create({
      showDate,
      numberOfShows,
      shows,
      managerId: managerId || null,
    });

    return res.status(201).json({
      success: true,
      message: "Show created successfully",
      data: show,
    });
  } catch (error) {
    console.error("Error creating show:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create show",
      error: error.message,
    });
  }
};

export const getShows = async (req, res) => {
  const { managerId } = req.body;
  if (!managerId) {
    return res.status(400).json({ message: "ManagerId Required", shows: [] });
  }
  const shows = await Show.find({ managerId: managerId });
  if (!shows) {
    return res.status(400).json({ message: "No Show Found", shows: [] });
  }
  return res.status(200).json({ message: "Show Found", shows: shows });
};
