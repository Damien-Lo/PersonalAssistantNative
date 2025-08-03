const express = require('express');
const { getAllDishes, postDishes, deleteDish, patchDish, getDishById } = require('../controllers/dishController');

const router = express.Router()

router.get('/', getAllDishes);
router.get("/:id", getDishById);
router.post('/', postDishes);
router.delete("/:id", deleteDish);
router.patch("/:id", patchDish);

module.exports = router;