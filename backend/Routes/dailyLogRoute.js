const express=require("express");
const { createLog, getLogByDate } = require("../Controllers/dailyLogController");
const router=express();

router.post("/addLog",createLog)
router.get("/getLogs",getLogByDate)

module.exports=router