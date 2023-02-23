const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignmentid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
    },
    studentid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    submission: {
      answer: {
        type: String,
        required: true,
      },
      subTasks: [
        {
          answer: {
            type: String,
            required: true,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Submission", submissionSchema);
