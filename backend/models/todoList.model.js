const mongoose = require("mongoose");
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  status: {
    type: String,
    trim: true,
    default: "open",
  },
  category: {
    type: String,
    trim: true,
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;
