const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");

router.post("/addStudent", adminController.addStudent);
router.get("/getAllAssignments", adminController.getAllAssignments);
router.get("/getassginment/:aid", adminController.getassignment);
router.put("/updateTask/:aid", adminController.updateAssignment);
router.delete("/deleteTask/:aid", adminController.deleteAssignment);
router.get("/getstudents", adminController.getstudent);
router.post("/savestudents", adminController.saveStudents);

module.exports = router;
