
const userModel=require("../Models/userModel")
const foodModel=require("../Models/foodModel")
const activityModel=require("../Models/activityModel")
const dailyLogModel=require("../Models/dailyLogModel")

const createLog = async (req, res) => {
    try {
      const { userId, date, foodLog, activityLog } = req.body;
  
      // Fetch user details
      const user = await userModel.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });
  
      // Calculate BMR
      let bmr = 0;
      if (user.sex === "male") {
        bmr = 66.4730 + (13.7516 * user.weight) + (5.0033 * user.height) - (6.7550 * user.age);
      } else {
        bmr = 655.0955 + (9.5634 * user.weight) + (1.8496 * user.height) - (4.6756 * user.age);
      }
  
      if (isNaN(bmr)) throw new Error("BMR calculation resulted in NaN");
  
      // Calculate total food calories (Calories In)
      let totalCaloriesIn = 0;
      for (const entry of foodLog) {
        const food = await foodModel.findById(entry.foodId);
        if (!food) continue;
        const calories = food.caloriesPerServing * entry.portion;
        totalCaloriesIn += calories;
      }
  
      if (isNaN(totalCaloriesIn)) throw new Error("Calories In calculation failed");
  
      // Calculate total activity calories (Calories Out)
      let totalCaloriesOut = 0;
      for (const entry of activityLog) {
        const activity = await activityModel.findById(entry.activityId);
        if (!activity) continue;
        const caloriesBurned = activity.METs * user.weight * (entry.duration / 60);
        totalCaloriesOut += caloriesBurned;
      }
  
      if (isNaN(totalCaloriesOut)) throw new Error("Calories Out calculation failed");
  
      // Calculate net calories
      const netCalories = totalCaloriesIn - bmr - totalCaloriesOut;
  
      if (isNaN(netCalories)) throw new Error("Net Calories calculation failed");
  
      // Create daily log entry
      const newLog = new dailyLogModel({
        userId,
        date,
        foodLog,
        activityLog,
        bmr,
        totalCaloriesIn,
        totalCaloriesOut,
        netCalories
      });
  
      await newLog.save();
      res.status(201).json({ message: "Log created successfully", log: newLog });
  
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message || "Something went wrong" });
    }
  };
  const getLogByDate = async (req, res) => {
    try {
      const { userId, date } = req.query;
      const log = await dailyLogModel.findOne({ userId, date: new Date(date) })
        .populate('foodLog.foodId')
        .populate('activityLog.activityId');
      if (!log) return res.status(404).json({ message: 'Log not found' });
      res.json(log);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  module.exports={createLog,getLogByDate}