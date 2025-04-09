const express=require("express");
const { createLog, getLogByDate,getAllLogs, createActivityLog,getLogsById } = require("../Controllers/dailyLogController");
const router=express();

router.post("/addLog",createLog)
router.get("/getLogs",getLogByDate)
router.get("/allLogs", getAllLogs);
router.post("/addActivityLog",createActivityLog)
router.get("/getLogs/:id",getLogsById)

module.exports=router