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
        const allItems = await foodModel.find({}).limit(8000).sort({ foodName: 1 });

        return res.status(200).json({
            status: "success",
            data: allItems
        });
    } catch (error) {
        console.log("error in getting all foods:", error);
        return res.status(400).json({
            success: false,
            message: "Error in getting all foods",
        });
    }
};


  
module.exports={allFood}