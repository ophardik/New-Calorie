
const userModel=require("../Models/userModel")
const foodModel=require("../Models/foodModel")
const activityModel=require("../Models/activityModel")
const dailyLogModel=require("../Models/dailyLogModel")
const mongoose=require("mongoose")

const createLog = async (req, res) => {
  try {
    const { userId, date, foodLog } = req.body;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    // Fetch user
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Calculate BMR
    let bmr = 0;
    if (user.gender === "male") {
      bmr = 66.4730 + (13.7516 * user.weight) + (5.0033 * user.height) - (6.7550 * user.age);
    } else {
      bmr = 655.0955 + (9.5634 * user.weight) + (1.8496 * user.height) - (4.6756 * user.age);
    }

    bmr = parseFloat(bmr.toFixed(2));
    if (isNaN(bmr)) {
      return res.status(400).json({ error: "Failed to calculate BMR" });
    }

    // Calories In
    let totalCaloriesIn = 0;
    const enrichedFoodLog = [];

    for (const entry of foodLog) {
      const { foodId, portion, time } = entry;

      const food = await foodModel.findById(foodId).lean();
      if (!food) {
        return res.status(404).json({ error: `Food item not found for ID: ${foodId}` });
      }

      const caloriesPerServing = Number(food.caloriesPerServing);
      const validPortion = Number(portion);
      const caloriesForEntry = caloriesPerServing * validPortion;

      if (isNaN(caloriesForEntry)) {
        return res.status(400).json({ error: "Invalid portion or caloriesPerServing" });
      }

      totalCaloriesIn += caloriesForEntry;

      enrichedFoodLog.push({
        foodId,
        foodName: food.foodName,
        caloriesPerServing,
        portion: validPortion,
        totalCalories: parseFloat(caloriesForEntry.toFixed(2)),
        time,
      });
    }

    totalCaloriesIn = parseFloat(totalCaloriesIn.toFixed(2));
    const totalCaloriesOut = 0;
    const netCalories = parseFloat((totalCaloriesIn - bmr).toFixed(2));

    if (isNaN(totalCaloriesIn) || isNaN(netCalories)) {
      return res.status(400).json({ error: "Invalid calorie values. Ensure correct food and portion data." });
    }

    // Save to DB
    const newLog = new dailyLogModel({
      userId,
      date,
      foodLog: enrichedFoodLog,
      activityLog: [], // Not handled here
      bmr,
      totalCaloriesIn,
      totalCaloriesOut,
      netCalories,
    });

    await newLog.save();

    res.status(201).json({ message: "Log created successfully", log: newLog });
  } catch (error) {
    console.error("Error creating daily log:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
};
const createActivityLog = async (req, res) => {
  try {
    const { userId, activityId, duration, date } = req.body;

    if (!userId || !activityId || !duration || !date) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Fetch user to get weight
    const user = await userModel.findById(userId);
    if (!user || !user.weight) {
      return res.status(404).json({ message: "User or weight not found." });
    }

    // Fetch activity to get MET value
    const activity = await activityModel.findById(activityId);
    if (!activity || !activity.METs) {
      return res.status(404).json({ message: "Activity or METs not found." });
    }

    // Convert duration from "hh:mm" to decimal hours
    const [hours, minutes] = duration.split(':').map(Number);
    const durationInHours = hours + (minutes / 60);

    // Calculate caloriesOut
    const caloriesOut = activity.METs * user.weight * durationInHours;

    // Save the activity log
    const newLog = await activityModel.create({
      userId,
      activityId,
      duration,
      date,
      caloriesOut
    });

    return res.status(201).json({
      message: "Activity log created successfully.",
      data: newLog
    });

  } catch (error) {
    console.log("❌ Error in creating activityLog:", error);
    return res.status(500).json({
      message: "Internal server error while creating activity log."
    });
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

  const getAllLogs=async(req,res)=>{
    try {
      const {userId}=req.query;
      const logs=await dailyLogModel.find({userId}).sort({date:-1})
      .populate('foodLog.foodId')
      .populate('activityLog.activityId')
      return res.status(200).json({success:true,data:logs})
    } catch (error) {
      console.log("error in getting all logs",error)
      return res.status(400).json({success:false,message:"Error in getting all logs"})
    }
  }
  
  module.exports={createLog,getLogByDate,getAllLogs,createActivityLog}