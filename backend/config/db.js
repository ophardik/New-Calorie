const mongoose=require("mongoose");
require("dotenv").config();

async function connectToDB(){
   try {
    const conn=await mongoose.connect(process.env.MONGO_URI)
    console.log("connected to DB")
   } catch (error) {
    console.log("error while connecting with DB",error)
   }
}

module.exports={connectToDB}