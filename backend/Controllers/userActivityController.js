const userActivityModel = require("../Models/userActivityModel");
const userModel = require("../Models/userModel");
const dailyLogModel = require("../Models/dailyLogModel");

const addUserActivity = async (req, res) => {
  try {
    const { userId, activityId, activityName, duration, METvalue, date } = req.body;

    if (!userId || !activityId || !activityName || !duration || !METvalue) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const weight = user.weight;
    const [hours, minutes] = duration.split(':').map(Number);
    const durationInHours = hours + (minutes / 60);

    const caloriesOut = METvalue * weight * durationInHours;
    if (isNaN(caloriesOut)) {
      return res.status(400).json({ message: "Invalid duration or values used for caloriesOut" });
    }

    
    const userActivity = new userActivityModel({
      userId,
      activityId,
      activityName,
      duration,
      METvalue,
      caloriesOut,
      date: date || new Date()
    });
    await userActivity.save();

  
    const logDate = new Date(date).setHours(0, 0, 0, 0); 
    const dailyLog = await dailyLogModel.findOneAndUpdate(
      { userId, date: logDate },
      {
        $push: {
          activityLog: {
            activityId,
            duration,
            caloriesOut
          }
        },
        $inc: { totalCaloriesOut: caloriesOut }
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: "Activity added successfully",
      userActivity,
      dailyLog
    });

  } catch (error) {
    console.error("Error adding user activity:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { addUserActivity };
