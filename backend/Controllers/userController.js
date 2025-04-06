const userModel = require("../Models/userModel");

const addUser=async(req,res)=>{
    try {
       const{name,email,weight,height,gender,age}=req.body;
       if(!name || !email || !weight || !gender || !height || !age){
        return res.status(400).json({error:"Please fill in all fields."});
       } 
       const exisitingUser=await userModel.findOne({email});
       if(exisitingUser){
        return res.status(400).json({error:"Email already in use."});
        }
        const user=await userModel.create({
            name,email,weight,height,gender,age
        })
        res.status(201).json({
            success:true,
            messsage:"User added successfully",
            user
        });
    } catch (error) {
        console.log("error in adding user",error);
        return res.status(400).json({
            message: "Error in adding user",
            error: error.message
        })
    }
}

const allUsers=async(req,res)=>{
    try {
        const allUsers=await userModel.find({})
        const structured=await allUsers.map((user)=>({
            id:user._id,
            name:user.name,
            email:user.email,
            weight:user.weight,
            height:user.height,
            gender:user.gender
        }))
        res.status(200).json({
            success:true,
            messsage:"All users fetched successfully",
            users:structured
            });
    } catch (error) {
        console.log("error while getting all user",error)
        return res.status(400).json({
            success:"false",
            message: "Error in getting all users",
        })
    }
}

const updateUser = async (req, res) => {
    try {
      const { name, email, height, weight, gender } = req.body;
  
      const updatedUser = await userModel.findByIdAndUpdate(
        req.params.id,
        { name, email, height, weight, gender },
        { new: true }
      );
  
      return res.status(200).json({
        success: true,
        message: "User info updated successfully",
        user: updatedUser,
      });
  
    } catch (error) {
      console.error("Error while updating user info:", error);
      return res.status(400).json({
        success: false,
        message: "Error in updating user info",
      });
    }
  };

const singleUser=async(req,res)=>{
    try {
        const user=await userModel.findById(req.params.id);
        if(!user) return res.status(404).json({success:false,message:"User not found"})
            return res.status(200).json({success:true,message:"User found",user:user})
    } catch (error) {
        console.log("error in getting specific user",error)
        return res.status(400).json({
            success:false,
            message:"Error in getting specific user"
            })
    }
}

const deleteUser=async(req,res)=>{
    try {
        const user=await userModel.findByIdAndDelete(req.params.id);
        if(!user) return res.status(404).json({success:false,message:"User not found"})
            return res.status(200).json({success:true,message:"User deleted successfully"})
    } catch (error) {
        console.log("error in deleting user",error);
        return res.status(400).json({
            success:false,
            message:"Cannot delete user"
        })
    }
}
  
module.exports={addUser,allUsers,updateUser,singleUser,deleteUser}