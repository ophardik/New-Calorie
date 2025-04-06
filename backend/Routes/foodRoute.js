const express=require("express");
const { allFood } = require("../Controllers/foodController");
const router=express();

router.get("/allFood",allFood)

module.exports=router