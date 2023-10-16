const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type:String,
    trim: true,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
