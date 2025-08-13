const Dish = require("../models/Dish");

const getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find({
      owner: req.userId,
    }).populate("ingredientsList.ingredientObject");
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dishes", error });
  }
};

const getDishById = async (req, res) => {
  try {
    const dish = await Dish.findOne({
      _id: req.params.id,
      owner: req.userId,
    }).populate("ingredientsList.ingredientObject");
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
      const docs = data.map((d) => ({ ...d, owner: req.userId }));
      const inserted = await Dish.insertMany(docs);
      await Dish.populate(inserted, {
        path: "ingredientsList.ingredientObject",
        match: { owner: req.userId },
      });
      return res.status(201).json(inserted);
    } else {
      const saved = await new Dish({ ...data, owner: req.userId }).save();
      await saved.populate({
        path: "ingredientsList.ingredientObject",
        match: { owner: req.userId },
      });
      return res.status(201).json(saved);
    }
  } catch (error) {
    return res.status(400).json({ message: "Error creating Dish", error });
  }
};

const deleteDish = async (req, res) => {
  try {
    const deleted = await Dish.findByIdAndDelete({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Dish not found" });
    }

    res.status(200).json({ message: "Dish deleted successfully", deleted });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const patchDish = async (req, res) => {
  try {
    const updated = await Dish.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      req.body,
      { new: true, runValidators: true }
    ).populate("ingredientsList.ingredientObject");
    if (!updated) return res.status(404).json({ message: "Dish not found" });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: "Update failed", e });
  }
};

module.exports = {
  getAllDishes,
  getDishById,
  postDishes,
  deleteDish,
  patchDish,
};
