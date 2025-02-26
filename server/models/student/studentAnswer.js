const mongoose = require("mongoose");

const StudentAnswerSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  }, // Reference to the exam
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  }, // Reference to the student
  answers: [
    {
      question_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to the question
      student_answer: { type: String, required: true }, // The student's answer
    },
  ],
  submittedAt: { type: Date, default: Date.now }, // Timestamp for when the answers were submitted
});

const StudentAnswer = mongoose.model("StudentAnswer", StudentAnswerSchema);

module.exports = StudentAnswer;
