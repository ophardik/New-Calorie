const acitivityModel = require("../Models/activityModel")

const allActivity=async(req,res)=>{
    try {
     const allItems=await acitivityModel.find({})
     return res.status(200).json({
        status:"success",
        data:allItems
     })
    } catch (error) {
        console.log("error in getting all activity",error)
        return res.status(400).json({
            success:"false",
            message: "Error in getting all activity"
        })
    }
}


module.exports={allActivity}