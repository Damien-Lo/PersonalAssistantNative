const mongoose = require("mongoose");

const calendarEventSchema = new mongoose.Schema(
  {
    //General Shared Variables
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    isRendered: {
      type: Boolean,
      default: true,
    },

    type: {
      type: String,
      enum: ["General Event", "Dining Event", "To Do Item"],
      default: "General Event",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    repeat: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly"],
      default: "none",
    },

    repeatUntil: {
      type: Date,
    },

    repeatDays: {
      type: [Number],
    },

    skipRenderDays: {
      type: [Date],
      default: [],
    },

    description: {
      type: String,
    },

    attendees: {
      type: [String],
    },

    //diningEvent Specific Itmes
    meal: {
      required: false,
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
      default: undefined,
    },
    dishList: {
      type: [
        {
          dishObject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dish",
            required: false,
          },
          loggedStatus: {
            type: Boolean,
            default: false,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CalendarEvent", calendarEventSchema);
