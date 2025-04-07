const mongoose = require("mongoose");

const userFoodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  foodName: { type: String, required: true },
  mealType: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner"],
    required: true,
  },
  portion: { type: Number, required: true }, // servings or grams
  foodGroup: { type: String, required: true }, // e.g., protein, carbs, fats, etc.
  date: { type: Date, required: true }, // stores when it was eaten
});

const UserFood = mongoose.model("UserFood", userFoodSchema);


module.exports=UserFood
