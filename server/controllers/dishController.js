const Dish = require("../models/Dish");

const getAllDishes = async (req, res) => {
    try {
        const dishes = await Dish.find().populate('ingredientsList.ingredientObject');
        res.json(dishes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching dishes", error });
    }
};


const getDishById = async (req, res) => {
    try {
        const dish = await Dish.findById(req.params.id).populate("ingredientsList.ingredientObject");
        if (!dish) return res.status(404).json({ message: "Dish not found" });
        res.json(dish);
    } catch (error) {
        console.error("Error fetching dish by ID:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


const postDishes = async (req, res) => {
    try {
        const data = req.body;

        if (Array.isArray(data)) {
            const inserted = await Dish.insertMany(data);
            return res.status(201).json(inserted);
        } else {
            const newDish = new Dish(data);
            const saved = await newDish.save();
            return res.status(201).json(saved);
        }
    } catch (error) {
        console.error("Error creating dish:", error);
        res.status(400).json({ message: "Error creating dish", error });
    }
};



const deleteDish = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Dish.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Dish not found" });
        }

        res.status(200).json({ message: "Dish deleted successfully", deleted });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const patchDish = async (req, res) => {
    const { id } = req.params;
    const update = req.body;
    try {
        const updatedDish = await Dish.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true,
        });

        if (!updatedDish) {
            return res.status(404).json({ message: "Dish not found" });
        }
        res.json(updatedDish);
    } catch (err) {
        console.error("Update failed:", err);
        res.status(500).json({ message: "Server error" });
    }

}

module.exports = {
    getAllDishes,
    getDishById,
    postDishes,
    deleteDish,
    patchDish
};
