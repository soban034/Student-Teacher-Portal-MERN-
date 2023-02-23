const mongoose = require("mongoose");

const Teacher = require("../models/teacher");
const Classroom = require("../models/classroom");
const Student = require("../models/student");
const Assignment = require("../models/assignment");

const addStudent = async (req, res, next) => {
  const { name, registrationNumber } = req.body;
  const student = new Student({
    name,
    registrationNumber,
  });
  student
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Student created",
        student: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

const getAllAssignments = async (req, res, next) => {
  try {
    const allclass = await Classroom.find()
      .populate({
        path: "assignments",
      })
      .populate("teacherid")
      .populate({
        path: "students",
      });
    res.status(200).json({
      message: "Fetched assignments successfully.",
      assignments: allclass,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

const getassignment = async (req, res, next) => {
  const aid = req.params.aid;
  try {
    const classroom = await Classroom.findById({ _id: aid }).populate({
      path: "assignments",
    });
    res.status(200).json({
      message: "Fetched assignment successfully.",
      assignments: classroom.assignments,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

const updateAssignment = async (req, res, next) => {
  const aid = req.params.aid;
  const { task, dueDate } = req.body;
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      { _id: aid },
      {
        task,
        dueDate,
      }
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

const deleteAssignment = async (req, res, next) => {
  const aid = req.params.aid;
  try {
    const assignment = await Assignment.findByIdAndDelete({ _id: aid });
    res.status(200).json({
      message: "Assignment deleted successfully.",
      assignment: assignment,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

const getstudent = async (req, res, next) => {
  try {
    const student = await Student.find({});
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
    res.status(200).json({
      message: "Student fetched successfully.",
      students: student,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

const saveStudents = async (req, res, next) => {
  const { students } = req.body;
  try {
    const student = await Student.insertMany(students);
    res.status(200).json({
      message: "Students saved successfully.",
      students: student,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

module.exports = {
  addStudent,
  getAllAssignments,
  getassignment,
  updateAssignment,
  deleteAssignment,
  getstudent,
  saveStudents,
};
