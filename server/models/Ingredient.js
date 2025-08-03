const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: String,
    description: String,
    category: String,
    expiryDate: Date,     // Change to Date Later
    brand: String,
    portionsAvaliable: Number,          //Need Someway to specify portion type
    portionUnit: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
    fiber: Number,
    sodium: Number
    // Perhaps Add other metric besides vitamins....
})

module.exports = mongoose.model('Ingredient', ingredientSchema);