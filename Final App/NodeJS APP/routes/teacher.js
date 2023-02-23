const express = require("express");
const router = express.Router();

const teacherController = require("../controllers/teacher");

router.post("/signup", teacherController.signUpTeacher);
router.post("/createclassroom", teacherController.createclassroom);
router.get("/allclassrooms/:tid", teacherController.getclassrooms);
router.get("/class/:cid", teacherController.getClassDetails);
router.get("/class/:cid/students", teacherController.getClassStudents);
router.get("/getsubmissions/:aid", teacherController.getSubmissions);
router.post("/postassignment", teacherController.uploadassignment);
router.post("/login", teacherController.loginTeacher);
router.post("/changeStatus", teacherController.changeStatus);
router.get(
  "/timeextensionrequests/:aid",
  teacherController.timeextensionrequests
);
router.post("/extendTime", teacherController.extendTime);
router.get("/getAssignmentStatus/:aid", teacherController.getAssignmentStatus);
router.put("/updateTask/:aid", teacherController.updateTask);

module.exports = router;
