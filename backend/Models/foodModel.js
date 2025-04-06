const mongoose=require("mongoose");

const foodSchema=new mongoose.Schema({
    foodName: { type: String, required: true },
  caloriesPerServing: { type: Number, required: true },
  servingSize: { type: String, required: true },
  foodGroup: String,
  fat: Number,
  protein: Number,
  carbs: Number,
})

const foodModel=mongoose.model("Food",foodSchema);

module.exports=foodModel