const express = require("express");
const router = express.Router();

const studentquesController = require("../controllers/studentques");

router.post("/studentquestion", studentquesController.addStudentques);
router.get("/getallquestions/:aid", studentquesController.getAllQuestions);

module.exports = router;
