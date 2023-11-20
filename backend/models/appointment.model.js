const mongoose = require("mongoose");
const appointmentSchema = new mongoose.Schema({
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
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
