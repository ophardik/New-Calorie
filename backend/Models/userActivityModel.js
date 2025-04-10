const mongoose=require("mongoose");
const userActivitySchema=new mongoose.Schema({
 
  userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      activityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
        required: true
      },
      duration: {
        type: String, 
        required: true
      },
      description:{
        type:String,
      },
      date: {
        type: String, 
        required: true
      },
      caloriesOut: {
        type: Number,
        required: true
      }
    
})

const userActitity=mongoose.model("UserActivity",userActivitySchema);

module.exports=userActitity