const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {                       // ✅ Add this field
    type: Number,
    required: true,
  },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
