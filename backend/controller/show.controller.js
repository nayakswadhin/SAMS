export const createShow = async (req, res) => {
  try {
    const { showDate, numberOfShows, timings, seatCategories, managerId } =
      req.body;

    // Validate required fields
    if (
      !showDate ||
      !numberOfShows ||
      !timings ||
      !seatCategories ||
      !seatCategories.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Validate timings match the numberOfShows
    if (timings.length !== numberOfShows) {
      return res.status(400).json({
        success: false,
        message: `Number of timings (${timings.length}) does not match numberOfShows (${numberOfShows})`,
      });
    }

    // Validate seat categories
    for (const category of seatCategories) {
      if (!category.category || !category.totalSeats || !category.price) {
        return res.status(400).json({
          success: false,
          message:
            "Each seat category must include category, totalSeats, and price",
        });
      }

      // Set availableSeats equal to totalSeats initially
      category.availableSeats = category.totalSeats;
    }

    // Create the show
    const show = await Show.create({
      showDate,
      numberOfShows,
      timings,
      seatCategories,
      managerId: managerId || null,
      createdBy: req.user._id, // Assuming you have user authentication middleware
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
