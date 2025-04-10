const foodModel = require("../Models/foodModel")

// const allFood=async(req,res)=>{
//     try {
//         const allItems=await foodModel.find({});
//         return res.status(200).json({
//             status:"success",
//             data:allItems
//         })
//     } catch (error) {
//         console.log("error in getting all foods")
//         return res.status(400).json({
//             success:true,
//             message: "Error in getting all foods",
//         })
//     }
// }
const allFood = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Default to page 1
      const limit = parseInt(req.query.limit) || 10; // Default 10 items per page
  
      const skip = (page - 1) * limit;
  
      const allItems = await foodModel.find({})
        .skip(skip)
        .limit(limit);
  
      const totalCount = await foodModel.countDocuments();
  
      return res.status(200).json({
        status: "success",
        data: allItems,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      });
    } catch (error) {
      console.log("error in getting all foods", error);
      return res.status(400).json({
        success: false,
        message: "Error in getting all foods",
      });
    }
  };
  
module.exports={allFood}