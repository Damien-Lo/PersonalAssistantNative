const CalendarEvent = require("../models/CalendarEvent");

const getAllCalendarEvents = async (req, res) => {
  try {
    const calendarEvents = await CalendarEvent.find({
      owner: req.userId,
    }).populate({
      path: "dishList.dishObject",
      populate: {
        path: "ingredientsList.ingredientObject",
        model: "Ingredient",
      },
    });
    res.json(calendarEvents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching caledarEvents", error });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await CalendarEvent.findById({
      _id: req.params.id,
      owner: req.userId,
    }).populate({
      path: "dishList.dishObject",
      populate: {
        path: "ingredientsList.ingredientObject",
        model: "Ingredient",
      },
    });

    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    console.error("Error fetching event with nested population:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const postCalendarEvent = async (req, res) => {
  try {
    const data = req.body;

    if (Array.isArray(data)) {
      const docs = data.map((d) => ({ ...d, owner: req.userId }));
      const inserted = await CalendarEvent.insertMany(docs);
      await CalendarEvent.populate({
        path: "dishList.dishObject",
        populate: {
          path: "ingredientsList.ingredientObject",
          model: "Ingredient",
        },
      });
      return res.status(201).json(inserted);
    } else {
      const saved = await new CalendarEvent({
        ...data,
        owner: req.userId,
      }).save();
      await saved.populate({
        path: "dishList.dishObject",
        populate: {
          path: "ingredientsList.ingredientObject",
          model: "Ingredient",
        },
      });
      return res.status(201).json(saved);
    }
  } catch (error) {
    return res.status(400).json({ message: "Error creating event", error });
  }
};

const deleteCalendarEvent = async (req, res) => {
  try {
    const deleted = await CalendarEvent.findByIdAndDelete({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "CalendarEvent not found" });
    }

    res
      .status(200)
      .json({ message: "CalendarEvent deleted successfully", deleted });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const patchCalendarEvent = async (req, res) => {
  try {
    const updatedCalendarEvent = await CalendarEvent.findByIdAndUpdate(
      { _id: req.params.id, owner: req.userId },
      req.body,
      { new: true, runValidators: true }
    ).populate({
      path: "dishList.dishObject",
      populate: {
        path: "ingredientsList.ingredientObject",
        model: "Ingredient",
      },
    });

    if (!updatedCalendarEvent) {
      return res.status(404).json({ message: "CalendarEvent not found" });
    }
    res.json(updatedCalendarEvent);
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllCalendarEvents,
  getEventById,
  postCalendarEvent,
  deleteCalendarEvent,
  patchCalendarEvent,
};
