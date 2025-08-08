const express = require('express');
const { getAllIngredients, postIngredients, deleteIngredient, patchIngredient } = require('../controllers/ingredientController');

const router = express.Router()

router.get('/', getAllIngredients);
router.post('/', postIngredients);
router.delete("/:id", deleteIngredient);
router.patch("/:id", patchIngredient);

module.exports = router;