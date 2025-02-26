const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  courseCode: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: "Teacher",
  },
  chapters: [
    {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
    },
  ],
  exams: [
    {
      type: Schema.Types.ObjectId,
      ref: "Exam",
    },
  ],
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  pendingStudents: [
    {
      student: { type: Schema.Types.ObjectId, ref: "Student" },
      status: {
        type: String,
        enum: ["pending", "approved"],
        default: "pending",
      },
    },
  ],
});

module.exports = mongoose.model("Course", courseSchema);
