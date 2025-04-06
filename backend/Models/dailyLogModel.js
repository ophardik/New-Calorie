const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  foodLog: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
      portion: Number,
      time: { type: String } // breakfast, lunch, etc.
    }
  ],
  activityLog: [
    {
      activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
      duration: Number // in minutes
    }
  ],
  bmr: Number,
  totalCaloriesIn: Number,
  totalCaloriesOut: Number,
  netCalories: Number
});

const dailyLogModel= mongoose.model('DailyLog', dailyLogSchema);

module.exports=dailyLogModel
