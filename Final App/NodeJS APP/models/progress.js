const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    assignmentid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    studentid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "In Progress",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Progress", progressSchema);
