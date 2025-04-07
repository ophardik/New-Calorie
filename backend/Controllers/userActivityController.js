const userActivityModel=require("../Models/userActivityModel") 
const addUserActivity=async(req,res)=>{
    try {
        const {userId,activityName,description,duration,METvalue,date}=req.body;
        const user=await userActivityModel.create({
            userId,activityName,description,duration,METvalue,date
        })
        return res.status(201).json({
            success:true,
            messsage:"User activity added successfully",
            user
        })
    } catch (error) {
      console.log("error in adding user activity",error);
      return res.status(400).json({
        message: "Error in adding user activity",
        success:"false"
      })
    }
}

module.exports={addUserActivity}