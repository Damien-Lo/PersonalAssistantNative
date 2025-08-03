const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    name: String,
    description: String,
    meals: [String],
    category: String,
    ingredientsList: [
        {
            ingredientObject: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Ingredient'
            },
            amount: Number
        }
    ],
    recipe: String,
    restaurant: String,

    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
    fiber: Number,
    sodium: Number
    // Perhaps Add other metric besides vitamins....
})

module.exports = mongoose.model('Dish', dishSchema);