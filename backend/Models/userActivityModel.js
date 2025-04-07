const mongoose=require("mongoose");
const userActivitySchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    activityName:{type:String,required:true},
    date:{type:String,required:true},
    duration:{type:String,required:true},
    description:{type:String,required:true},
    METvalue:{type:Number,required:true},

})

const userActitity=mongoose.model("UserActivity",userActivitySchema);

module.exports=userActitity