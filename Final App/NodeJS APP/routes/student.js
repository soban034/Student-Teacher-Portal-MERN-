const express = require("express");
const router = express.Router();

const studentController = require("../controllers/student");

router.post("/joinClass", studentController.joinClass);
router.get("/classroom/:cid/:sid", studentController.getClassroom);
router.post("/submitanswer", studentController.submitans);
router.post("/requestTime", studentController.requestExtraTime);
router.post("/checkrequestTime", studentController.checkrequestedExtraTime);
router.post("/getProgress", studentController.getProgress);
router.post("/setProgress", studentController.setProgress);
router.post("/getStatus", studentController.getStatus);
router.post("/setStatus", studentController.setStatus);

module.exports = router;
