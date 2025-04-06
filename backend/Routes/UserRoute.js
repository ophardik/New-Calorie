const express=require("express");
const { addUser, allUsers, updateUser, singleUser, deleteUser } = require("../Controllers/userController");
const router=express.Router();

router.post("/addUser",addUser)
router.get("/allUsers",allUsers)
router.patch("/updateUser/:id",updateUser)
router.get("/singleUser/:id",singleUser)
router.delete("/deleteUser/:id",deleteUser)


module.exports=router