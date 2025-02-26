const express = require("express");
const router = express.Router();
const roleMiddleware = require("../../middleware/auth");
const courseController = require("../../controllers/student/course");

router.post(
  "/:courseId/enroll-request",
  roleMiddleware(["student"]),
  courseController.requestEnrollment
);

module.exports = router;
