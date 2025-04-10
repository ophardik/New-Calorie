const mongoose = require("mongoose");

const userFoodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  foodName: { type: String, required: true },
  mealType: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner"],
    required: true,
  },
  portion: { type: Number, required: true }, 
  foodGroup: { type: String, required: true }, 
  date: { type: Date, required: true },
});

const UserFood = mongoose.model("UserFood", userFoodSchema);


module.exports=UserFood
