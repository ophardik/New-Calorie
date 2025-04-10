const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Food = require("../Models/foodModel");
const data = require("./food-calories.json"); // <- your converted JSON file
const { connectToDB } = require("../config/db");

dotenv.config();


connectToDB();

async function insertData() {
  try {
    const cleanedData = data .filter(item => item["Serving Description 1 (g)"]) 
    .map(item => ({
      foodName: item.name,
      foodGroup: item["Food Group"],
      caloriesPerServing: item["Calories"],
      fat: item["Fat (g)"],
      protein: item["Protein (g)"],
      carbs: item["Carbohydrate (g)"],
      servingSize: item["Serving Description 1 (g)"],
    })); 
  

    await Food.insertMany(cleanedData);
    console.log(` ${cleanedData.length} items inserted successfully`);

    const count = await Food.countDocuments();
    console.log(`📦 Total documents in DB: ${count}`);
    process.exit();
  } catch (err) {
    console.error(" Insertion failed:", err);
    process.exit(1);
  }
}
