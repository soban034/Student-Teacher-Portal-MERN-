const mongoose = require("mongoose");

const Teacher = require("../models/teacher");
const Classroom = require("../models/classroom");
const Student = require("../models/student");
const Assignment = require("../models/assignment");
const Submission = require("../models/submission");
const Progress = require("../models/progress");

const submitans = async (req, res, next) => {
  console.log(req.body.submission.subTasks);
  const submission = new Submission({
    assignmentid: req.body.assignmentid,
    studentid: req.body.studentid,
    submission: req.body.submission,
  });
  submission
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Assignment Submitted",
        submission: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

const joinClass = async (req, res, next) => {
  const student = await Student.findOne({
    registrationNumber: req.body.registrationNumber,
  });
  if (!student) {
    return res.status(404).json({ message: "Student not found!" });
  }
  const classroom = await Classroom.findOne({ _id: req.body.classroomid });
  if (!classroom) {
    return res.status(404).json({ message: "Classroom not found!" });
  }
  if (classroom.students.includes(student._id)) {
    return res.status(200).json({
      message: "Already joined class!",
      student: {
        name: student.name,
        registrationNumber: student.registrationNumber,
        id: student._id,
      },
    });
  }
  classroom.students.push(student);
  classroom.save();
  res.status(200).json({
    message: "Joined class!",
    student: {
      name: student.name,
      registrationNumber: student.registrationNumber,
      id: student._id,
    },
  });
};

const getClassroom = async (req, res, next) => {
  const classroom = await Classroom.findOne({ _id: req.params.cid }).populate({
    path: "assignments",
  });
  if (!classroom) {
    return res.status(404).json({ message: "Classroom not found!" });
  }
  if (classroom.assignments.length === 0) {
    return res
      .status(201)
      .json({ message: "No assignments found!", assignment: {} });
  }
  // get latest assignment
  classroom.assignments.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const latestAssignment = classroom.assignments[0];

  if (latestAssignment.onGoing === false) {
    return res
      .status(201)
      .json({ message: "No assignments found!", assignment: {} });
  }
  // check is student has submitted the assignment
  const submission = await Submission.findOne({
    assignmentid: latestAssignment._id,
    studentid: req.params.sid,
  });
  console.log(submission);

  if (submission) {
    return res.status(200).json({
      message: "Already submitted assignment!",
      assignment: {},
    });
  }
  res.status(200).json({
    message: "Assignment found!",
    assignment: latestAssignment,
  });
};

const requestExtraTime = async (req, res, next) => {
  const assignment = await Assignment.findOne({ _id: req.body.assignmentid });
  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found!" });
  }
  if (assignment.onGoing === false) {
    return res.status(404).json({ message: "Assignment not found!" });
  }

  let found = false;
  assignment.extendedTimeRequest.forEach((request) => {
    if (request.studentid.equals(req.body.studentid)) {
      found = true;
    }
  });
  if (found) {
    res.status(200).json({
      message: "Already requested for extra time!",
      request: true,
    });
  } else {
    assignment.extendedTimeRequest.push({
      studentid: req.body.studentid,
      requestedTime: req.body.extraTime,
    });
    assignment.save();
    res.status(200).json({
      message: "Requested for extra time!",
      request: true,
    });
  }
};

const checkrequestedExtraTime = async (req, res, next) => {
  const assignment = await Assignment.findOne({ _id: req.body.assignmentid });
  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found!" });
  }
  let found = false;
  assignment.extendedTimeRequest.forEach((request) => {
    if (request.studentid.equals(req.body.studentid)) {
      found = true;
    }
  });
  if (found) {
    res.status(200).json({
      message: "Already requested for extra time!",
      request: true,
    });
  } else {
    res.status(200).json({
      message: "Not requested for extra time",
      request: false,
    });
  }
};

const setProgress = async (req, res, next) => {
  const progress = await Progress.findOne({
    assignmentid: req.body.aid,
    studentid: req.body.sid,
  });
  if (progress) {
    progress.progress = req.body.progress;
    progress.save();
    return res.status(200).json({
      message: "Progress updated!",
      progress: progress,
    });
  } else {
    const progress = new Progress({
      assignmentid: req.body.aid,
      studentid: req.body.sid,
      progress: req.body.progress,
    });
    progress.save();
    res.status(200).json({
      message: "Progress updated!",
      progress: progress,
    });
  }
};

const getProgress = async (req, res, next) => {
  const progress = await Progress.findOne({
    assignmentid: req.body.aid,
    studentid: req.body.sid,
  });
  if (progress) {
    return res.status(200).json({
      message: "Progress found!",
      progress: progress,
    });
  } else {
    return res.status(200).json({
      message: "Progress not found!",
      progress: {},
    });
  }
};

const setStatus = async (req, res, next) => {
  const progress = await Progress.findOne({
    assignmentid: req.body.aid,
    studentid: req.body.sid,
  });
  if (progress) {
    if (progress.status === "In Progress") {
      progress.status = req.body.status;
      progress.save();
      return res.status(200).json({
        message: "Status updated!",
        progress: progress,
      });
    } else {
      return res.status(200).json({
        message: "Already Submitted!",
        progress: progress,
      });
    }
  } else {
    const progress = new Progress({
      assignmentid: req.body.aid,
      studentid: req.body.sid,
      status: req.body.status,
    });
    progress.save();
    res.status(200).json({
      message: "Status updated!",
      progress: progress,
    });
  }
};

const getStatus = async (req, res, next) => {
  const progress = await Progress.findOne({
    assignmentid: req.body.aid,
    studentid: req.body.sid,
  });
  if (progress) {
    return res.status(200).json({
      message: "Status found!",
      progress: progress,
    });
  } else {
    return res.status(200).json({
      message: "Status not found!",
      progress: {},
    });
  }
};

module.exports = {
  joinClass,
  getClassroom,
  submitans,
  requestExtraTime,
  checkrequestedExtraTime,
  setProgress,
  getProgress,
  setStatus,
  getStatus,
};
