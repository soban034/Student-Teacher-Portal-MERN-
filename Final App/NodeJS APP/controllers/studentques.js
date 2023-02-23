const mongoose = require("mongoose");

const StudentQuestion = require("../models/studentques");

const addStudentques = async (req, res, next) => {
  const { studentid, question, assignmentid } = req.body;
  const studentques = new StudentQuestion({
    studentid,
    question,
    assignmentid,
  });
  studentques
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Student qestion asked",
        studentques: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

const getAllQuestions = async (req, res, next) => {
  const aid = req.params.aid;
  try {
    const studentques = await StudentQuestion.find({ assignmentid: aid });
    res.status(200).json({
      message: "Fetched Questions successfully.",
      questions: studentques,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

const createanswer = async (req, res, next) => {
  const { answer, questionid, assingmentid } = req.body;
  const ans = { answer };
  const studentques = await StudentQuestion.findById(questionid, assingmentid);
  studentques.answer.push(ans);

  studentques
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Question asked",
        studentques,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

module.exports = {
  addStudentques,
  getAllQuestions,
  createanswer,
};
