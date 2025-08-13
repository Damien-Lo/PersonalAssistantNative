const Ingredient = require("../models/Ingredient");
const mongoose = require("mongoose");
const { Types } = mongoose;

const getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find({
      owner: req.userId,
    });
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ingredients", error });
  }
};

const postIngredients = async (req, res) => {
  try {
    const data = req.body;
    if (Array.isArray(data)) {
      const docs = data.map((d) => ({ ...d, owner: req.userId }));
      const inserted = await Ingredient.insertMany(docs);
      return res.status(201).json(inserted);
    } else {
      const newIngredient = new Ingredient({ ...data, owner: req.userId });
      const saved = await newIngredient.save();
      return res.status(201).json(saved);
    }
  } catch (error) {
    res.status(400).json({ message: "Error creating ingredient", error });
  }
};

const deleteIngredient = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Ingredient.findOneAndDelete({
      _id: id,
      owner: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    res
      .status(200)
      .json({ message: "Ingredient deleted successfully", deleted });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const patchIngredient = async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  try {
    const updated = await Ingredient.findOneAndUpdate(
      { _id: id, owner: req.userId },
      update,
      { new: true, runValidators: true }
    );

    if (!updatedIngredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }
    res.json(updatedIngredient);
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllIngredients,
  postIngredients,
  deleteIngredient,
  patchIngredient,
};
