const mongoose=require("mongoose");

const foodSchema=new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  foodLog: [
    {
      foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
      },
      foodName: String,
      caloriesPerServing: Number,
      portion: Number,
      totalCalories: Number,
      time: String,
    }
  ],
  activityLog: {
    type: Array,
    default: [],
  },
  bmr: Number,
  totalCaloriesIn: Number,
  totalCaloriesOut: Number,
  netCalories: Number,
})

const foodModel=mongoose.model("Food",foodSchema);

module.exports=foodModel