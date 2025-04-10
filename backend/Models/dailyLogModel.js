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
      foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
        required: true
      },
      portion: {
        type: Number,
        required: true
      },

    }
  ],
  activityLog: [
    {
      activityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
        required: true
      },
      duration: {
        type: String, 
        required: true
      },
      caloriesOut: {
        type: Number,
      },
      description: {
        type: String,
      }
    }
  ],
  bmr: {
    type: Number,
    default: 0
  },
  totalCaloriesIn: {
    type: Number,
    default: 0
  },
  totalCaloriesOut: {
    type: Number,
    default: 0
  },
  netCalories: {
    type: Number,
    default: 0
  }
});

const dailyLogModel = mongoose.model('DailyLog', dailyLogSchema);

module.exports = dailyLogModel;
