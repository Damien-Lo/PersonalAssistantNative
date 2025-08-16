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
      required: true,
    },

    repeatUntil: {
      type: Date,
      required: false,
    },

    repeatDays: {
      type: [Number],
      required: true,
    },

    skipRenderDays: {
      type: [Date],
      default: [],
      required: true,
    },

    description: {
      type: String,
      requried: true,
    },

    attendees: {
      type: [String],
    },

    //diningEvent Specific Itmes
    meal: {
      required: false,
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
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
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CalendarEvent", calendarEventSchema);
