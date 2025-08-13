const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      default: "Unnamed Dish",
    },
    description: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
      default: "Uncategorised",
    },
    meals: {
      type: [String],
      required: true,
      default: [],
    },
    ingredientsList: {
      type: [
        {
          ingredientObject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ingredient",
          },
          amount: Number,
        },
      ],
      required: true,
      default: [],
    },
    recipe: {
      type: String,
      required: false,
    },
    restaurant: {
      type: String,
      required: false,
    },
    calories: {
      type: Number,
      required: false,
    },
    protein: {
      type: Number,
      required: false,
    },
    carbs: {
      type: Number,
      required: false,
    },

    fats: {
      type: Number,
      required: false,
    },
    fiber: {
      type: Number,
      required: false,
    },
    sodium: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dish", dishSchema);
