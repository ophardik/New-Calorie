const express=require("express");
const { createLog, getLogByDate,getAllLogs, createActivityLog } = require("../Controllers/dailyLogController");
const router=express();

router.post("/addLog",createLog)
router.get("/getLogs",getLogByDate)
router.get("/allLogs", getAllLogs);
router.post("/allActivityRoute",createActivityLog)

module.exports=router