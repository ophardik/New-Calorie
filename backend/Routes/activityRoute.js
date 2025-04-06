const express=require("express");
const { allActivity } = require("../Controllers/activityController");
const router=express();

router.get("/allActivity",allActivity)


module.exports=router