const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question_number: { type: Number, required: true },
  question: { type: String, required: true },
  model_answer: { type: String, required: true }, // Required for all question types
  grading_criteria: { type: [String], default: [] }, // Optional grading criteria
  choices: { type: [String], default: null }, // Used for MCQs, null for others
  correct_answer: { type: String }, // Stores correct MCQ choice or "true"/"false"
});

const SectionSchema = new mongoose.Schema({
  section_number: { type: Number, required: true },
  section_title: { type: String, required: true },
  questions: { type: [QuestionSchema], required: true },
});

const ExamSchema = new mongoose.Schema({
  exam_topic: { type: String, required: true },
  sections: { type: [SectionSchema], required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  }, // Reference to Course
});

const Exam = mongoose.model("Exam", ExamSchema);

module.exports = Exam;
