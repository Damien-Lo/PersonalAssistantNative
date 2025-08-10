const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "Unnamed Ingredient",
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
  expiryDate: {
    type: Date,
    required: false,
  },
  brand: {
    type: String,
    required: true,
    default: "Generic",
  },
  portionsAvaliable: {
    type: Number,
    required: false,
    default: null,
  },
  portionUnit: {
    type: String,
    required: true,
    default: null,
  },
  calories: {
    type: Number,
    required: true,
    default: 0,
  },
  protein: {
    type: Number,
    required: true,
    default: 0,
  },
  carbs: {
    type: Number,
    required: true,
    default: 0,
  },
  fats: {
    type: Number,
    required: true,
    default: 0,
  },
  fiber: {
    type: Number,
    required: true,
    default: 0,
  },
  sodium: {
    type: Number,
    required: true,
    default: 0,
  },
  // Perhaps Add other metric besides vitamins....
});

module.exports = mongoose.model("Ingredient", ingredientSchema);
