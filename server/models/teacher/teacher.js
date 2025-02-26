const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure emails are unique
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  birthdate: {
    type: Date, // Store birthdate as a Date type
    required: true, // Make it required (optional based on use case)
  },
  gender: {
    type: String,
    enum: ["Male", "Female"], // Restrict to specific values
    required: true, // Make it required (optional based on use case)
  },
  profilePicture: { type: String },
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

module.exports = mongoose.model("Teacher", teacherSchema);
