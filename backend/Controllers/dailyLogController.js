const userModel=require("../Models/userModel")
const foodModel=require("../Models/foodModel")
const activityModel=require("../Models/activityModel")
const dailyLogModel=require("../Models/dailyLogModel")
const mongoose=require("mongoose")

const createLog = async (req, res) => {
// try {
//   const { userId, date, foodLog = [], activityLog = [], bmr = 0 } = req.body;

//   const normalizedDate = new Date(date).toISOString().split("T")[0];
//   let log = await dailyLogModel.findOne({ userId, date: new Date(normalizedDate) });

//   if (!log) {
//     log = new dailyLogModel({
//       userId,
//       date: new Date(normalizedDate),
//       foodLog: [],
//       activityLog: [],
//       bmr: !isNaN(bmr) ? bmr : 0,
//     });
//   }

//   // Append new logs
//   if (foodLog.length > 0) log.foodLog.push(...foodLog);
//   if (activityLog.length > 0) log.activityLog.push(...activityLog);

//   // Calculate totalCaloriesIn
//   let totalCaloriesIn = 0;

//   for (const item of log.foodLog) {
//     const food = await foodModel.findById(item.foodId).lean();
//     console.log("food", food);
  
//     const portion = !isNaN(item.portion) ? item.portion : 1;
//     const calories = (food?.caloriesPerServing || 0) * portion;
  
//     console.log("caloriesPerServing", food?.caloriesPerServing);
//     console.log("portion", item.portion);
//     console.log("calculatedCalories", calories);
  
//     item.caloriesIn = calories;
//     totalCaloriesIn += calories;
//   }
  
//   console.log("totalCaloriesIn",totalCaloriesIn)

//   // Calculate totalCaloriesOut
//   const weightInKg = 70;
//   let totalCaloriesOut = 0;

//   for (const item of log.activityLog) {
//     const activity = await activityModel.findById(item.activityId);
//     let minutes = 0;

//     if (item.duration) {
//       if (item.duration.includes(":")) {
//         const [hh, mm] = item.duration.split(":").map(Number);
//         if (!isNaN(hh) && !isNaN(mm)) minutes = hh * 60 + mm;
//       } else {
//         const parsed = parseInt(item.duration);
//         if (!isNaN(parsed)) minutes = parsed;
//       }
//     }

//     if (activity && typeof activity.METs === "number" && minutes > 0) {
//       const durationInHours = minutes / 60;
//       const caloriesOut = activity.METs * weightInKg * durationInHours;
//       item.caloriesOut = Math.round(caloriesOut);
//       totalCaloriesOut += item.caloriesOut;
//     } else {
//       item.caloriesOut = 0;
//     }
//   }

//   log.totalCaloriesIn = totalCaloriesIn;
//   log.totalCaloriesOut = totalCaloriesOut;
//   const safeBMR = !isNaN(log.bmr) ? log.bmr : 0;

//   log.netCalories = Math.round((safeBMR + totalCaloriesIn) - totalCaloriesOut);

//   await log.save();

//   res.status(200).json({
//     message: "Log created or updated successfully",
//     log,
//   });

// } catch (err) {
//   console.error("Error in createOrUpdateDailyLog:", err);
//   res.status(500).json({ error: err.message });
// };
  
try {
  const { userId, date, foodLog = [], activityLog = [] } = req.body;

  const normalizedDate = new Date(date).toISOString().split("T")[0];
  let log = await dailyLogModel.findOne({ userId, date: new Date(normalizedDate) });

  const user = await userModel.findById(userId).lean();

  let bmr = 0;

  if (user) {
    const weight = user.weight || 70;
    const height = user.height || 170;
    const gender = user.gender || 'male';
    const age=user.age
    

    if (gender === 'male') {
      bmr = Math.round(66.4730 + (13.7516 * weight) + (5.0033 * height) - (6.7550 * age));
    } else {
      bmr = Math.round(655.0955 + (9.5634 * weight) + (1.8496 * height) - (4.6756 * age));
    }

    if (isNaN(bmr)) {
      bmr = 0;
    }
  }

  if (!log) {
    log = new dailyLogModel({
      userId,
      date: new Date(normalizedDate),
      foodLog: [],
      activityLog: [],
      bmr: bmr,
    });
  } else {
    log.bmr = bmr;
  }

  if (foodLog.length > 0) log.foodLog.push(...foodLog);
  if (activityLog.length > 0) log.activityLog.push(...activityLog);

  let totalCaloriesIn = 0;

  for (const item of log.foodLog) {
    const food = await foodModel.findById(item.foodId).lean();
    const portion = !isNaN(item.portion) ? item.portion : 1;
    const calories = (food?.caloriesPerServing || 0) * portion;
    item.caloriesIn = calories;
    totalCaloriesIn += calories;
  }

  const weightInKg = 70;
  let totalCaloriesOut = 0;

  for (const item of log.activityLog) {
    const activity = await activityModel.findById(item.activityId);
    let minutes = 0;

    if (item.duration) {
      if (item.duration.includes(":")) {
        const [hh, mm] = item.duration.split(":").map(Number);
        if (!isNaN(hh) && !isNaN(mm)) minutes = hh * 60 + mm;
      } else {
        const parsed = parseInt(item.duration);
        if (!isNaN(parsed)) minutes = parsed;
      }
    }

    if (activity && typeof activity.METs === "number" && minutes > 0) {
      const durationInHours = minutes / 60;
      const caloriesOut = activity.METs * weightInKg * durationInHours;
      item.caloriesOut = Math.round(caloriesOut);
      totalCaloriesOut += item.caloriesOut;
    } else {
      item.caloriesOut = 0;
    }
  }

  log.totalCaloriesIn = totalCaloriesIn;
  log.totalCaloriesOut = totalCaloriesOut;

  const safeBMR = !isNaN(log.bmr) ? log.bmr : 0;
  log.netCalories = Math.round((safeBMR + totalCaloriesIn) - totalCaloriesOut);

  await log.save();

  res.status(200).json({
    message: "Log created or updated successfully",
    log,
  });

} catch (err) {
  console.error("Error in createOrUpdateDailyLog:", err);
  res.status(500).json({ error: err.message });
}



}



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
  module.exports={getLogByDate,getAllLogs,createActivityLog,getLogsById,createLog}