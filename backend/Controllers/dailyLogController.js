const userModel=require("../Models/userModel")
const foodModel=require("../Models/foodModel")
const activityModel=require("../Models/activityModel")
const dailyLogModel=require("../Models/dailyLogModel")
const mongoose=require("mongoose")

const createLog = async (req, res) => {
  try {
    const { userId, date, foodLog = [], activityLog = [] } = req.body;

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

    // -------------------- Calories In --------------------
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

    // -------------------- Calories Out --------------------
    let totalCaloriesOut = 0;
    const enrichedActivityLog = [];

    for (const activityEntry of activityLog) {
      const { activityId, duration } = activityEntry;

      const activity = await activityModel.findById(activityId).lean();
      if (!activity || !activity.METs) {
        return res.status(404).json({ error: `Activity not found for ID: ${activityId}` });
      }

      const [hours, minutes] = duration.split(":").map(Number);
      const durationInHours = hours + (minutes / 60);
      const caloriesOut = activity.METs * user.weight * durationInHours;

      totalCaloriesOut += caloriesOut;

      enrichedActivityLog.push({
        activityId,
        activityName: activity.activityName,
        METs: activity.METs,
        duration,
        caloriesOut: parseFloat(caloriesOut.toFixed(2)),
      });
    }
    totalCaloriesOut = parseFloat(totalCaloriesOut.toFixed(2));

    // -------------------- Save or Update Log --------------------
    let log = await dailyLogModel.findOne({ userId, date });

    if (log) {
      // Update existing log
      log.foodLog.push(...enrichedFoodLog);
      log.activityLog.push(...enrichedActivityLog);
      log.totalCaloriesIn += totalCaloriesIn;
      log.totalCaloriesOut += totalCaloriesOut;
      log.netCalories = parseFloat((log.totalCaloriesIn - log.bmr - log.totalCaloriesOut).toFixed(2));

      await log.save();
      return res.status(200).json({ message: "Log updated successfully", log });
    } else {
      // Create new log
      const newLog = new dailyLogModel({
        userId,
        date,
        foodLog: enrichedFoodLog,
        activityLog: enrichedActivityLog,
        bmr,
        totalCaloriesIn,
        totalCaloriesOut,
        netCalories: parseFloat((totalCaloriesIn - bmr - totalCaloriesOut).toFixed(2)),
      });

      await newLog.save();
      return res.status(201).json({ message: "Log created successfully", log: newLog });
    }
  } catch (error) {
    console.error("Error creating/updating daily log:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
};


// const createActivityLog = async (req, res) => {
//   try {
//     const { userId, activityId, duration, date } = req.body;

//     if (!userId || !activityId || !duration || !date) {
//       return res.status(400).json({ message: "Missing required fields." });
//     }

//     // Fetch user to get weight
//     const user = await userModel.findById(userId);
//     if (!user || !user.weight) {
//       return res.status(404).json({ message: "User or weight not found." });
//     }

//     // Fetch activity to get MET value
//     const activity = await activityModel.findById(activityId);
//     if (!activity || !activity.METs) {
//       return res.status(404).json({ message: "Activity or METs not found." });
//     }

//     // Convert duration from "hh:mm" to decimal hours
//     const [hours, minutes] = duration.split(':').map(Number);
//     const durationInHours = hours + (minutes / 60);

//     // Calculate caloriesOut
//     const caloriesOut = activity.METs * user.weight * durationInHours;

//     // Save the activity log
//     const newLog = await activityModel.create({
//       userId,
//       activityId,
//       duration,
//       date,
//       caloriesOut
//     });

//     return res.status(201).json({
//       message: "Activity log created successfully.",
//       data: newLog
//     });

//   } catch (error) {
//     console.log("❌ Error in creating activityLog:", error);
//     return res.status(500).json({
//       message: "Internal server error while creating activity log."
//     });
//   }
// };
const createActivityLog = async (req, res) => {
  try {
    const { userId, activityId, duration, date } = req.body;

    if (!userId || !activityId || !duration || !date) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Normalize date to YYYY-MM-DD (midnight time)
    const normalizedDate = new Date(new Date(date).toISOString().split('T')[0]);

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
    const caloriesOut = parseFloat((activity.METs * user.weight * durationInHours).toFixed(2));

    // Find or create daily log
    let log = await dailyLogModel.findOne({ userId, date: normalizedDate });

    if (!log) {
      // Calculate BMR if new log
      let bmr = 0;
      if (user.gender === "male") {
        bmr = 66.4730 + (13.7516 * user.weight) + (5.0033 * user.height) - (6.7550 * user.age);
      } else {
        bmr = 655.0955 + (9.5634 * user.weight) + (1.8496 * user.height) - (4.6756 * user.age);
      }
      bmr = parseFloat(bmr.toFixed(2));

      // Create new daily log
      const newLog = new dailyLogModel({
        userId,
        date: normalizedDate,
        bmr,
        foodLog: [],
        activityLog: [{
          activityId,
          activityName: activity.activityName,
          METs: activity.METs,
          duration,
          caloriesOut
        }],
        totalCaloriesIn: 0,
        totalCaloriesOut: caloriesOut,
        netCalories: parseFloat((0 - bmr - caloriesOut).toFixed(2)),
      });

      await newLog.save();
      return res.status(201).json({ message: "Daily log created with activity.", log: newLog });
    } else {
      // Update existing log
      log.activityLog.push({
        activityId,
        activityName: activity.activityName,
        METs: activity.METs,
        duration,
        caloriesOut
      });

      log.totalCaloriesOut += caloriesOut;
      log.totalCaloriesOut = parseFloat(log.totalCaloriesOut.toFixed(2));

      log.netCalories = parseFloat((log.totalCaloriesIn - log.bmr - log.totalCaloriesOut).toFixed(2));

      await log.save();
      return res.status(200).json({ message: "Activity added to daily log.", log });
    }

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
  
  const getLogsById=async (req,res)=>{
    try {
      const log=await dailyLogModel.findById(req.params.id)
      .populate('foodLog.foodId')
      .populate('activityLog.activityId')
      return res.status(200).json({success:true,data:log})
    } catch (error) {
      console.log("error in getting logs by id",error)
      return res.status(400).json({success:false,message:"Error in getting logs by id"})
    }
  }
  module.exports={createLog,getLogByDate,getAllLogs,createActivityLog,getLogsById}