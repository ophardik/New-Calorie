const express=require("express");
const cors=require("cors")
const { connectToDB } = require("./config/db");
const userRoute=require("./Routes/UserRoute")
const foodRoute=require("./Routes/foodRoute")
const activityRoute=require("./Routes/activityRoute")
const dailyLogRoute=require("./Routes/dailyLogRoute");
const UserFoodRoute=require("./Routes/userFoodRoute")
const userActivityRoute=require("./Routes/userActivity")

require("dotenv").config();
const app=express();

app.use(express.json());
app.use(cors());
connectToDB();

app.use("/user",userRoute)
app.use("/food",foodRoute)
app.use("/activity",activityRoute)
app.use("/dailylog",dailyLogRoute)
app.use("/userFood",UserFoodRoute)
app.use("/userActivity",userActivityRoute)




app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})