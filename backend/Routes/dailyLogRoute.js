const express=require("express");
const { createLog, getLogByDate,getAllLogs } = require("../Controllers/dailyLogController");
const router=express();

router.post("/addLog",createLog)
router.get("/getLogs",getLogByDate)
router.get("/allLogs", getAllLogs);


module.exports=router