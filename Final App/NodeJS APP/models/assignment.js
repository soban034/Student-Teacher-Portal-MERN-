const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    classroomid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
    },
    task: {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      subTasks: [
        {
          name: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
        },
      ],
    },
    dueDate: {
      type: Number,
      required: true,
    },
    extendedTimeRequest: [
      {
        studentid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
        requestedTime: {
          type: Number,
          required: true,
        },
      },
    ],
    onGoing: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
