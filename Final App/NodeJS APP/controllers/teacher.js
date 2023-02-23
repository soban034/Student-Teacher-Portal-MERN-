const mongoose = require("mongoose");

const Teacher = require("../models/teacher");
const Classroom = require("../models/classroom");
const Assignment = require("../models/assignment");
const Submission = require("../models/submission");
const Progress = require("../models/progress");

const signUpTeacher = async (req, res, next) => {
  const teacher = new Teacher({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    subject: req.body.subject,
  });
  teacher
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Teacher created",
        teacher: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

const loginTeacher = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const teacher = await Teacher.findOne({ email });
  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found!" });
  } else if (teacher.password !== password) {
    return res.status(401).json({ message: "Incorrect email or password!" });
  }
  res.status(200).json({
    message: "Logged in!",
    teacher: {
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject,
      id: teacher._id,
    },
  });
};

const createclassroom = async (req, res, next) => {
  const classroom = new Classroom({
    name: req.body.name,
    teacherid: req.body.teacherid,
  });
  classroom
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Classroom created",
        classroom: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

const uploadassignment = async (req, res, next) => {
  const assignment = new Assignment({
    classroomid: req.body.classroomid,
    task: req.body.task,
    dueDate: req.body.dueDate,
  });

  const classroom = await Classroom.findByIdAndUpdate(
    { _id: req.body.classroomid },
    { $push: { assignments: assignment._id } },
    { new: true }
  );
  if (!classroom) {
    return res.status(404).json({ message: "Something went wrong!" });
  }

  assignment
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Assignment created",
        assignment: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

const getclassrooms = async (req, res, next) => {
  const teacherid = req.params.tid;
  const classrooms = await Classroom.find({ teacherid: teacherid });
  if (!classrooms) {
    return res.status(404).json({ message: "Classrooms not found!" });
  }
  res.status(200).json({
    message: "Classrooms found!",
    classrooms: classrooms,
  });
};

const getClassDetails = async (req, res, next) => {
  const classroomid = req.params.cid;
  const classroom = await Classroom.findById({ _id: classroomid })
    .populate({
      path: "assignments",
    })
    .populate({
      path: "students",
    });
  if (!classroom) {
    return res.status(404).json({ message: "Classroom not found!" });
  }
  res.status(200).json({
    message: "Class found!",
    classroom: classroom,
  });
};

const getClassStudents = async (req, res, next) => {
  const classroomid = req.params.cid;
  const classroom = await Classroom.findById({ _id: classroomid })
    .populate({
      path: "students",
    })
    .exec();
  if (!classroom) {
    return res.status(404).json({ message: "Classroom not found!" });
  }
  res.status(200).json({
    message: "Class found!",
    students: classroom.students,
  });
};

const changeStatus = async () => {
  const allassignments = await Assignment.find();
  if (!allassignments) {
    return;
  }
  allassignments.forEach(async (changeassignment) => {
    if (new Date(changeassignment.dueDate) < new Date()) {
      const assignment = await Assignment.findByIdAndUpdate(
        { _id: changeassignment._id },
        { $set: { onGoing: false } },
        { new: true }
      );
    }
  });
};

const getSubmissions = async (req, res, next) => {
  const assignmentId = req.params.aid;
  console.log(assignmentId);
  const submissions = await Submission.find({ assignmentid: assignmentId });
  if (!submissions) {
    return res
      .status(404)
      .json({ message: "Submissions not found!", submissions: [] });
  }
  res.status(200).json({
    message: "Submissions found!",
    submissions: submissions,
  });
};

const timeextensionrequests = async (req, res, next) => {
  const assignmentId = req.params.aid;
  const assignment = await Assignment.findById({ _id: assignmentId });
  if (!assignment) {
    return res
      .status(404)
      .json({ message: "Assignment not found!", requests: [] });
  }
  res.status(200).json({
    message: "Extension Found!",
    requests: assignment.extendedTimeRequest,
  });
};

const extendTime = async (req, res, next) => {
  console.log(req.body);
  const assignment = await Assignment.findByIdAndUpdate(
    { _id: req.body.aid },
    { $set: { dueDate: req.body.time } },
    { new: true }
  );
  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found!" });
  }
  res.status(200).json({
    message: "Time extended!",
    assignment: assignment,
  });
};

const getAssignmentStatus = async (req, res, next) => {
  const assignmentId = req.params.aid;
  const progress = await Progress.find({ assignmentid: assignmentId });
  if (!progress) {
    return res.status(404).json({ message: "Progress not found!" });
  }
  res.status(200).json({
    message: "Progress found!",
    progress: progress,
  });
};

const updateTask = async (req, res, next) => {
  const aid = req.params.aid;
  const { task, dueDate } = req.body;
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      { _id: aid },
      {
        task,
        dueDate,
      },
      { new: true }
    );
    res.status(200).json({
      message: "Assignment updated successfully.",
      assignment: assignment,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

module.exports = {
  loginTeacher,
  signUpTeacher,
  getclassrooms,
  getClassStudents,
  getClassDetails,
  getSubmissions,
  createclassroom,
  uploadassignment,
  changeStatus,
  timeextensionrequests,
  extendTime,
  getAssignmentStatus,
  updateTask,
};
