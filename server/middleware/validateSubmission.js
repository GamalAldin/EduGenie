const Exam = require("../models/teacher/exam");
const Student = require("../models/student/student");
const ExamResult = require("../models/student/examResult");
const mongoose = require("mongoose");

// exports.validateSubmission = async (req, res, next) => {
//   try {
//     const { examId } = req.params;
//     const { sections } = req.body; // Access the submitted sections array
//     const studentId = req.user.id;

//     // Validate ObjectId
//     if (
//       !mongoose.Types.ObjectId.isValid(examId) ||
//       !mongoose.Types.ObjectId.isValid(studentId)
//     ) {
//       return res.status(400).json({ message: "Invalid examId or studentId." });
//     }

//     // Fetch exam and student in parallel
//     const [exam, student] = await Promise.all([
//       Exam.findById(examId).populate("course"),
//       Student.findById(studentId),
//     ]);

//     if (!exam) return res.status(404).json({ message: "Exam not found." });
//     if (!student)
//       return res.status(404).json({ message: "Student not found." });

//     // Check if the student is enrolled in the course
//     if (!student.courses.includes(exam.course._id.toString())) {
//       return res
//         .status(403)
//         .json({ message: "You are not enrolled in this course." });
//     }

//     // Flatten all questions from the exam's sections
//     const allQuestions = exam.sections.flatMap((section) => section.questions);

//     // Validate that submitted answers reference valid questions
//     const validQuestionIds = allQuestions.map((question) =>
//       question._id.toString()
//     );
//     const allSubmittedAnswers = sections.flatMap(
//       (section) => section.questions
//     );

//     const invalidAnswers = allSubmittedAnswers.filter(
//       (answer) => !validQuestionIds.includes(answer.question_id)
//     );

//     if (invalidAnswers.length) {
//       return res.status(400).json({
//         message: "Invalid answers submitted.",
//         invalidAnswers,
//       });
//     }

//     // Prepare validated answers for ExamResult
//     req.validatedAnswers = {
//       exam: examId,
//       student: studentId,
//       evaluations: allSubmittedAnswers
//         .map((answer) => {
//           const question = allQuestions.find(
//             (q) => q._id.toString() === answer.question_id
//           );

//           if (!question) {
//             console.error(
//               `Question not found for question_id: ${answer.question_id}`
//             );
//             return null; // Handle this gracefully later
//           }

//           return {
//             question_id: question._id, // Add question_id for reference
//             question: question.question, // Store question text
//             student_answer: answer.student_answer,
//             total_score: 0, // To be updated after correction
//             max_score: parseInt(question.full_mark || 0, 10), // Default to 0 if missing
//             breakdown: [], // To be filled after correction
//           };
//         })
//         .filter((evaluation) => evaluation !== null), // Remove null entries
//     };

//     // Validate all evaluations have question_id
//     if (req.validatedAnswers.evaluations.some((eval) => !eval.question_id)) {
//       return res.status(400).json({
//         message:
//           "Invalid evaluations: Some evaluations are missing `question_id`.",
//       });
//     }

//     // Proceed to the next middleware
//     next();
//   } catch (error) {
//     console.error("Error in validateSubmission:", error.message || error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// };

// Middleware: validateSubmission
exports.validateSubmission = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const { sections } = req.body;
    const studentId = req.user.id;

    // Validate ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(examId) ||
      !mongoose.Types.ObjectId.isValid(studentId)
    ) {
      return res.status(400).json({ message: "Invalid examId or studentId." });
    }

    // Fetch exam and student in parallel
    const [exam, student] = await Promise.all([
      Exam.findById(examId).populate("course"),
      Student.findById(studentId),
    ]);

    if (!exam) return res.status(404).json({ message: "Exam not found." });
    if (!student)
      return res.status(404).json({ message: "Student not found." });

    // Check if the student is enrolled in the course
    if (!student.courses.includes(exam.course._id.toString())) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this course." });
    }

    // Flatten all questions from the exam's sections
    const allQuestions = exam.sections.flatMap((section) => section.questions);
    const validQuestionIds = allQuestions.map((q) => q._id.toString());

    // Validate submitted answers reference valid questions
    const allSubmittedAnswers = sections.flatMap(
      (section) => section.questions || []
    );

    const invalidAnswers = allSubmittedAnswers.filter(
      (answer) => !validQuestionIds.includes(answer.question_id.toString())
    );

    if (invalidAnswers.length) {
      return res.status(400).json({
        message: "Invalid answers submitted.",
        invalidAnswers,
      });
    }

    // Prepare `sections` for ExamResult
    const validatedSections = exam.sections.map((examSection) => {
      const submittedSection = sections.find(
        (s) => s.section_number === examSection.section_number
      );

      return {
        section_number: examSection.section_number,
        section_title: examSection.section_title,
        questions_type: examSection.questions_type,
        evaluations: submittedSection
          ? submittedSection.questions
              .map((submittedQuestion) => {
                const question = examSection.questions.find(
                  (q) => q._id.toString() === submittedQuestion.question_id
                );

                if (!question) {
                  console.error(
                    `Question not found for question_id: ${submittedQuestion.question_id}`
                  );
                  return null;
                }

                return {
                  question_id: question._id,
                  question: question.question,
                  student_answer: submittedQuestion.student_answer,
                  total_score: 0,
                  max_score: Number.isFinite(question.full_mark)
                    ? question.full_mark
                    : 0,
                  breakdown: [],
                };
              })
              .filter(Boolean)
          : [],
      };
    });

    req.validatedAnswers = {
      exam: examId,
      student: studentId,
      sections: validatedSections,
      total_score: 0,
      max_score: 0,
    };

    next();
  } catch (error) {
    console.error("Error in validateSubmission:", error.message || error);
    res.status(500).json({ message: "Internal server error." });
  }
};
