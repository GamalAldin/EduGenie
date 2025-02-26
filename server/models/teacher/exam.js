const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question_number: { type: Number, required: true },
  question: { type: String, required: true },
  model_answer: { type: String, required: true }, // Required for subjective questions
  grading_criteria: { type: [String], default: [] }, // Optional grading criteria
  full_mark: { type: Number, required: true, default: 0 }, // Changed to Number
  choices: { type: [String], default: null }, // Used for MCQs, null for others
  correct_answer: { type: String }, // Stores correct MCQ choice or "true"/"false"
});

const SectionSchema = new mongoose.Schema({
  section_number: { type: Number, required: true },
  section_title: { type: String, required: true },
  questions_type: { type: String, required: true },
  total_marks: { type: Number },
  questions: { type: [QuestionSchema], required: true },
});

const ExamSchema = new mongoose.Schema({
  exam_topic: { type: String, required: true },
  exam_type: { type: String },
  sections: { type: [SectionSchema], required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  }, // Reference to Course
  scheduledDateTime: { type: Date }, // Stores the date and time of the exam
  endTime: { type: Date }, // Stores the date and time of the exam
  duration: { type: Number }, // Duration of the exam in minutes
  isScheduled: { type: Boolean, default: false }, // Indicates if the exam is scheduled

  createdAt: { type: Date, default: Date.now }, // Automatically sets the creation date
});

ExamSchema.pre("save", function (next) {
  this.sections.forEach((section) => {
    section.questions.forEach((question) => {
      if (section.questions_type !== "essay" && !question.correct_answer) {
        return next(
          new Error("Objective questions must have a correct_answer.")
        );
      }
    });
  });
  next();
});

const Exam = mongoose.model("Exam", ExamSchema);

module.exports = Exam;
