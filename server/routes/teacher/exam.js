const express = require("express");
const examController = require("../../controller/teacher/exam");

const router = express.Router();

// Get all exams
router.get("/:courseId/exams", examController.getExams);

// Get single exam
router.get("/:courseId/exams/:examId", examController.getExam);

// Get student answer => only for testing
router.get("/answer", examController.getAnswer);

// Correct exam
router.get("/correct-exam", examController.correctExam);

// Generate exam
router.post("/generate-exam", examController.generateExam);

// Delete exam
router.delete("/:courseId/exams/:examId", examController.deleteExam);

module.exports = router;
