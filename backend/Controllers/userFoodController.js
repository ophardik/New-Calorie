const userFoodModel = require("../Models/userFood");

const addUserFood=async(req,res)=>{
    try {
        const {userId,foodName,mealType,portion,foodGroup,date}=req.body;
        const user=await userFoodModel.create({
            userId,foodName,mealType,portion,foodGroup,date
        })
        return res.status(201).json({
            success:true,
            messsage:"User food added successfully",
            user
        })
    } catch (error) {
      console.log("error in adding user food",error);
      return res.status(400).json({
        message: "Error in adding user food",
        success:"false"
      })
    }
}


module.exports={addUserFood}