
const mongoose = require("mongoose");
require("dotenv").config();

const activityModel = require("../Models/activityModel");
const data = require("./MET-values.json");
const { connectToDB } = require("../config/db");

connectToDB();

async function insertData() {
    try {
        const cleanedData = data.map(item => ({
            acitivityName: item.ACTIVITY,
            specificMotion: item["SPECIFIC MOTION"],
           
            METs: item.METs,
        }));

        await activityModel.insertMany(cleanedData);
        console.log(` ${cleanedData.length} items inserted successfully`);

        const count = await activityModel.countDocuments(); 
        console.log(` Total documents in DB: ${count}`);
        process.exit();
    } catch (error) {
        console.error(" Insertion failed:", error); 
        process.exit(1);
    }
}

insertData(); 
