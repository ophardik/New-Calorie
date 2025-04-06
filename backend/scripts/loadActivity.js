
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
            specificMotion: item["SPECIFIC MOTION"], /* why have we passeditem["SPECIFIC MOTION"] like this 
      Because :
      1.Dot Notation (only works if no spaces!) 
      2.It will treate SPECIIFC And MOTION as we are referring for two different things

      WHY BRACKET NOTATION WORKED!!!!!!!!!!!!!!! 
      In JS, an object is a collection of key-value pairs, like this:    
        const person = {
          name: "Hardik",
          age: 22
        };
        Here:
        
        name and age are keys
    "Hardik" and 22 are values
    You can access them like:
    console.log(person.name); // "Hardik"
    This is called dot notation.

    ❌ Problem with Dot Notation
    Dot notation only works if:

    The key doesn’t have spaces
    The key is a valid JS identifier (no -, special characters, etc.)
    Example:
    const obj = {
      "first name": "Hardik",
      "user-role": "admin"
    };
    console.log(obj.first name);    // ❌ Syntax error
    console.log(obj.user-role);     // ❌ This subtracts role from user (invalid)

    ✅ Why Bracket Notation Works
    Bracket notation works because it treats the key as a string.
    console.log(obj["first name"]);  // ✅ "Hardik"
    console.log(obj["user-role"]);   // ✅ "admin"
    How it works internally:
    JavaScript objects store keys as strings
    Bracket notation lets you pass any string key — even ones with spaces, hyphens, or numbers
    You can even do:

    const key = "first name";
    console.log(obj[key]); // ✅ "Hardik"
    So it’s more powerful and flexible.
      */
            METs: item.METs,
        }));

        await activityModel.insertMany(cleanedData);
        console.log(`✅ ${cleanedData.length} items inserted successfully`);

        const count = await activityModel.countDocuments(); //   changed from Food to activityModel
        console.log(`📦 Total documents in DB: ${count}`);
        process.exit();
    } catch (error) {
        console.error(" Insertion failed:", error); //  was using 'err' instead of 'error'
        process.exit(1);
    }
}

insertData(); //  call the function to run
