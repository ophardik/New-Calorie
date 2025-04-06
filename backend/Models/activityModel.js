const mongoose=require("mongoose");
const activitySchema=new mongoose.Schema({
    acitivityName:{
        type:String,
        required:true
    },
    specificMotion:{
        type:String,
        required:true,
    },
    METs:{
        type:Number,
        required:true
    }
})
const acitivityModel=mongoose.model("Activity",activitySchema);

module.exports=acitivityModel