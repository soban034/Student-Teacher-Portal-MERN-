const mongoose = require("mongoose");

const studentquesSchema = new mongoose.Schema({
  studentid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  assignmentid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  question: {
    type: String,
  },
  answer: {
    type: String,
  },
});

module.exports = mongoose.model("StudentQuestion", studentquesSchema);
