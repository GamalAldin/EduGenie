// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const CriterionSchema = new Schema({
//   criterion: { type: String }, // Grading criterion
//   points_awarded: { type: Number }, // Points awarded for the criterion
//   feedback: { type: String }, // Feedback for the criterion
// });

// const EvaluationSchema = new Schema({
//   question_id: { type: Schema.Types.ObjectId, ref: "Question", required: true }, // Reference to the question
//   question: { type: String, required: true }, // Question text
//   student_answer: { type: String }, // Student's answer
//   total_score: { type: Number, required: true, default: 0 }, // Total score for the question
//   max_score: { type: Number, required: true, default: 0 }, // Maximum possible score for the question
//   breakdown: { type: [CriterionSchema] }, // Breakdown of points by criteria
// });

// const ExamResultSchema = new Schema({
//   exam: {
//     type: Schema.Types.ObjectId,
//     ref: "Exam",
//     required: true, // Reference to the exam being corrected
//     index: true,
//   },
//   student: {
//     type: Schema.Types.ObjectId,
//     ref: "Student",
//     required: true, // Reference to the student whose answers were corrected
//     index: true,
//   },
//   evaluations: { type: [EvaluationSchema], required: true }, // Evaluations for each question
//   total_score: { type: Number, required: true, default: 0 }, // Total score for the exam
//   max_score: { type: Number, required: true, default: 0 }, // Maximum possible score for the exam
//   createdAt: { type: Date, default: Date.now }, // Timestamp for when the correction was completed
// });

// module.exports = mongoose.model("ExamResult", ExamResultSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CriterionSchema = new Schema({
  criterion: { type: String }, // Grading criterion
  points_awarded: { type: Number }, // Points awarded for the criterion
  feedback: { type: String }, // Feedback for the criterion
});

const EvaluationSchema = new Schema({
  question_id: { type: Schema.Types.ObjectId, ref: "Question", required: true }, // Reference to the question
  question: { type: String, required: true }, // Question text
  student_answer: { type: String }, // Student's answer
  total_score: { type: Number, required: true, default: 0 }, // Total score for the question
  max_score: { type: Number, required: true, default: 0 }, // Maximum possible score for the question
  breakdown: { type: [CriterionSchema] }, // Breakdown of points by criteria
});

const SectionResultSchema = new Schema({
  section_number: { type: Number, required: true }, // Section number
  section_title: { type: String }, // Section title
  questions_type: { type: String }, // Type of questions in the section (essay, mcq, true/false)
  evaluations: { type: [EvaluationSchema], required: true }, // Evaluations for each question in the section
});

const CheatingSchema = new Schema({
  cheated: { type: Boolean },
  reason: { type: String },
});

const ExamResultSchema = new Schema({
  exam: {
    type: Schema.Types.ObjectId,
    ref: "Exam",
    required: true, // Reference to the exam being corrected
    index: true,
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true, // Reference to the student whose answers were corrected
    index: true,
  },
  sections: { type: [SectionResultSchema], required: true }, // Sections with evaluations
  total_score: { type: Number, required: true, default: 0 }, // Total score for the exam
  max_score: { type: Number, required: true, default: 0 }, // Maximum possible score for the exam
  cheated: { type: CheatingSchema },
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the correction was completed
});

module.exports = mongoose.model("ExamResult", ExamResultSchema);
