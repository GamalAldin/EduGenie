const express = require("express");
const examController = require("../../controllers/teacher/exam");
const roleMiddleware = require("../../middleware/auth");

const router = express.Router();

// Get all exams
router.get(
  "/:courseId/exams",
  roleMiddleware(["teacher"]),
  examController.getExams
);

// Get single exam
router.get(
  "/:courseId/exams/:examId",
  roleMiddleware(["teacher"]),
  examController.getExam
);

// Get student answer => only for testing
router.get("/answer", examController.getAnswer);

// Correct exam
// router.get("/correct-exam", examController.correctExam1);

// Generate exam
router.post(
  "/generate-exam",
  roleMiddleware(["teacher"]),
  examController.generateExam
);

// Schedule an exam
router.post(
  "/schedule-exam",
  roleMiddleware(["teacher"]),
  examController.scheduleExam
);

// Get upcoming exams
router.get(
  "/upcoming-exams",
  roleMiddleware(["teacher"]),
  examController.getUpcomingExams
);

// Route to get all results for an exam
router.get(
  "/:examId/results",
  roleMiddleware(["teacher"]),
  examController.getExamResults
);

// Route to get a specific student's result for an exam
router.get(
  "/:examId/results/:studentId",
  roleMiddleware(["teacher"]),
  examController.getStudentExamResult
);

// Get list of exams that contain results
router.get(
  "/examResults",
  roleMiddleware(["teacher"]),
  examController.getTeacherExamResults
);

// Delete exam
router.delete(
  "/:courseId/exams/:examId",
  roleMiddleware(["teacher"]),
  examController.deleteExam
);

// Add a question to a section
router.post(
  "/:courseId/exams/:examId/sections/:sectionId/questions",
  roleMiddleware(["teacher"]),
  examController.addQuestion
);

// Edit a question in a section
router.put(
  "/:courseId/exams/:examId/sections/:sectionId/questions/:questionId",
  roleMiddleware(["teacher"]),
  examController.editQuestion
);

// Delete a question from a section
router.delete(
  "/:courseId/exams/:examId/sections/:sectionId/questions/:questionId",
  roleMiddleware(["teacher"]),
  examController.deleteQuestion
);

// Edit student's mark(s)
router.put(
  "/:examId/students/:studentId/update-score",
  roleMiddleware(["teacher"]),
  examController.updateStudentScore
);

module.exports = router;
