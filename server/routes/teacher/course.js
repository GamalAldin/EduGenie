const express = require("express");
const router = express.Router();
const roleMiddleware = require("../../middleware/auth");
const courseController = require("../../controllers/teacher/course");

// Get all courses
router.get(
  "/courses",
  roleMiddleware(["teacher", "student"]),
  courseController.getCourses
);

// Create a course
router.post(
  "/course",
  roleMiddleware(["teacher"]),
  courseController.createCourse
);

// Edit course
router.put(
  "/course/:id",
  roleMiddleware(["teacher"]),
  courseController.updateCourse
);

// Delete course
router.delete(
  "/course/:id",
  roleMiddleware(["teacher"]),
  courseController.deleteCourse
);

// Enroll Student Route
router.post(
  "/:courseId/enroll-student",
  roleMiddleware(["teacher"]),
  courseController.enrollStudent
);

// Approve enrollment request
router.patch(
  "/:courseId/enrollments/:studentId",
  roleMiddleware(["teacher"]),
  courseController.approveEnrollment
);

// List of enrollment requests
router.get(
  "/:courseId/pending-enrollments",
  roleMiddleware(["teacher"]),
  courseController.getPendingEnrollments
);

// Get all enrolled students
router.get(
  "/:courseId/enrolled-students",
  roleMiddleware(["teacher"]),
  courseController.getEnrolledStudents
);

// Remove student from course
router.delete(
  "/:courseId/remove-student",
  roleMiddleware(["teacher"]),
  courseController.removeStudent
);

module.exports = router;
