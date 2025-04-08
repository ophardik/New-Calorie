const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Food = require("../Models/foodModel");
const data = require("./food-calories.json"); // <- your converted JSON file
const { connectToDB } = require("../config/db");

dotenv.config();

// DB connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {
//   console.log(" MongoDB connected");
//   return insertData();
// })
// .catch((err) => console.error(" MongoDB connection error:", err));
connectToDB();

// Function to insert data
async function insertData() {
  try {
    const cleanedData = data .filter(item => item["Serving Description 1 (g)"]) // skip if missing
    .map(item => ({
      foodName: item.name,
      foodGroup: item["Food Group"],
      caloriesPerServing: item["Calories"],
      fat: item["Fat (g)"],
      protein: item["Protein (g)"],
      carbs: item["Carbohydrate (g)"],
      servingSize: item["Serving Description 1 (g)"],
    })); // Reshapes every item into the format expected by your Mongoose model.
  

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
