const express=require("express");
const { addUserFood } = require("../Controllers/userFoodController");
const router=express.Router();

router.post("/addUserFood",addUserFood)


module.exports=router