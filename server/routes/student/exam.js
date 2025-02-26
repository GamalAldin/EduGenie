const express = require("express");
const examController = require("../../controllers/student/exam");
const roleMiddleware = require("../../middleware/auth");
const { validateSubmission } = require("../../middleware/validateSubmission");
const {
  correctExam,
  getExamResult,
} = require("../../controllers/teacher/exam");
const ExamResult = require("../../models/student/examResult");

const router = express.Router();

// Correct exam
// router.get("/correct-test", examController.correctTest);

// Get single exam
router.get(
  "/:courseId/exams/:examId",
  roleMiddleware(["student"]),
  examController.getExam
);

// Get upcoming exams
router.get(
  "/upcoming-exams",
  roleMiddleware(["student"]),
  examController.getUpcomingExams
);

// router.post(
//   "/:examId/submit",
//   roleMiddleware(["student"]),
//   validateSubmission,
//   async (req, res) => {
//     const { examId } = req.params;
//     const { validatedAnswers } = req;

//     try {
//       if (!validatedAnswers) {
//         return res.status(400).json({ message: "Invalid submission data." });
//       }

//       // Check for existing submission
//       const existingResult = await ExamResult.findOne({
//         exam: examId,
//         student: validatedAnswers.student,
//       });

//       if (existingResult) {
//         return res.status(400).json({
//           message: "You have already submitted this exam.",
//         });
//       }

//       // Save the validated answers to ExamResult
//       const examResult = new ExamResult(validatedAnswers);
//       await examResult.save();

//       // Execute the `correctExam` function after submission
//       try {
//         await correctExam({
//           examId,
//           studentId: validatedAnswers.student,
//         });

//         // Fetch the updated examResult
//         const updatedResult = await ExamResult.findById(examResult._id);
//         console.log(
//           `Exam ${examId} corrected for student ${validatedAnswers.student}.`
//         );

//         res.status(200).json({
//           message: "Answers submitted successfully.",
//           examResult: updatedResult,
//         });
//       } catch (correctionError) {
//         console.error(
//           `Error correcting exam ${examId} for student ${validatedAnswers.student}:`,
//           correctionError.message || correctionError
//         );

//         res.status(200).json({
//           message: "Answers submitted successfully. Correction in progress.",
//           examResult,
//         });
//       }
//     } catch (error) {
//       console.error("Error submitting answers:", error.message || error);
//       res.status(500).json({
//         message: "An error occurred while submitting answers.",
//       });
//     }
//   }
// );

// Route to get exam result for a student after the exam ends

router.post(
  "/:examId/submit",
  roleMiddleware(["student"]),
  validateSubmission,
  async (req, res) => {
    const { examId } = req.params;
    const { validatedAnswers } = req;

    try {
      if (!validatedAnswers) {
        return res.status(400).json({ message: "Invalid submission data." });
      }

      // Check for existing submission
      const existingResult = await ExamResult.findOne({
        exam: examId,
        student: validatedAnswers.student,
      });

      if (existingResult) {
        return res.status(400).json({
          message: "You have already submitted this exam.",
        });
      }

      // Save the validated answers to ExamResult
      const examResult = new ExamResult({
        exam: validatedAnswers.exam,
        student: validatedAnswers.student,
        sections: validatedAnswers.sections, // Add validated sections
        total_score: 0, // Initialize score
        max_score: 0, // Initialize max score
      });

      await examResult.save();

      // Execute the `correctExam` function after submission
      try {
        await correctExam({
          examId,
          studentId: validatedAnswers.student,
        });

        // Fetch the updated ExamResult
        const updatedResult = await ExamResult.findById(examResult._id);
        console.log(
          `Exam ${examId} corrected for student ${validatedAnswers.student}.`
        );

        res.status(200).json({
          message: "Answers submitted successfully.",
          examResult: updatedResult,
        });
      } catch (correctionError) {
        console.error(
          `Error correcting exam ${examId} for student ${validatedAnswers.student}:`,
          correctionError.message || correctionError
        );

        res.status(200).json({
          message: "Answers submitted successfully. Correction in progress.",
          examResult,
        });
      }
    } catch (error) {
      console.error("Error submitting answers:", error.message || error);
      res.status(500).json({
        message: "An error occurred while submitting answers.",
      });
    }
  }
);

router.get(
  "/:examId/result",
  roleMiddleware(["student"]),
  examController.getExamResult
);

// Get all results for a specific exam the student has taken
router.get(
  "/:examId/myResult",
  roleMiddleware(["student"]),
  examController.getStudentExamResult
);

// Get all exams the student has taken
router.get(
  "/myResults",
  roleMiddleware(["student"]),
  examController.getStudentExamResults
);

// Cancel exam due to cheating
router.post(
  "/:examId/students/:studentId/cancel",
  roleMiddleware(["student"]),
  examController.cancelExamDueToCheating
);

// Route to check cheating status
router.get(
  "/:examId/students/:studentId/cheating-status",
  roleMiddleware(["student"]),
  examController.getCheatingStatus
);

module.exports = router;
