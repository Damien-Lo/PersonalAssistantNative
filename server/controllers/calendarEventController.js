const CalendarEvent = require("../models/CalendarEvent");

const getAllCalendarEvents = async (req, res) => {
    try {
        const calendarEvents = await CalendarEvent.find().populate({
            path: "dishList.dishObject",
            populate: {
                path: "ingredientsList.ingredientObject",
                model: "Ingredient"
            }
        });
        res.json(calendarEvents);
    } catch (error) {
        res.status(500).json({ message: "Error fetching caledarEvents", error });
    }
};

const getEventById = async (req, res) => {
    try {
        const event = await CalendarEvent.findById(req.params.id)
            .populate({
                path: "dishList.dishObject",
                populate: {
                    path: "ingredientsList.ingredientObject",
                    model: "Ingredient"
                }
            })

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
            const inserted = await CalendarEvent.insertMany(data);
            return res.status(201).json(inserted);
        } else {
            const newCalendarEvent = new CalendarEvent(data);
            const saved = await newCalendarEvent.save();
            return res.status(201).json(saved);
        }
    } catch (error) {
        console.error("Error creating calendarEvent:", error);
        res.status(400).json({ message: "Error creating calendarEvent", error });
    }
};



const deleteCalendarEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await CalendarEvent.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "CalendarEvent not found" });
        }

        res.status(200).json({ message: "CalendarEvent deleted successfully", deleted });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const patchCalendarEvent = async (req, res) => {
    const { id } = req.params;
    const update = req.body;
    try {
        const updatedCalendarEvent = await CalendarEvent.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true,
        });

        if (!updatedCalendarEvent) {
            return res.status(404).json({ message: "CalendarEvent not found" });
        }
        res.json(updatedCalendarEvent);
    } catch (err) {
        console.error("Update failed:", err);
        res.status(500).json({ message: "Server error" });
    }

}

module.exports = {
    getAllCalendarEvents,
    getEventById,
    postCalendarEvent,
    deleteCalendarEvent,
    patchCalendarEvent
};
