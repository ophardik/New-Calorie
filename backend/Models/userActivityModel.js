const mongoose=require("mongoose");
const userActivitySchema=new mongoose.Schema({
    // userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    // activityName:{type:String,required:true},
    // date:{type:String,required:true},
    // duration:{type:String,required:true},
    // description:{type:String,required:true},
    // METvalue:{type:Number,required:true},

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
        type: String, // expected format: "hh:mm"
        required: true
      },
      date: {
        type: String, // or Date, depending on your app format
        required: true
      },
      caloriesOut: {
        type: Number,
        required: true
      }
    
})

const userActitity=mongoose.model("UserActivity",userActivitySchema);

module.exports=userActitity