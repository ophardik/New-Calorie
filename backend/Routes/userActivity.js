const express=require("express")
const { addUserActivity } = require("../Controllers/userActivityController");

const router=express.Router();

router.post("/addUserActivity",addUserActivity)

module.exports=router