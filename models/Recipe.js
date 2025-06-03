const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    ingredients: [String],
    steps: [String],
    author: String,
    tags: [String],
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
