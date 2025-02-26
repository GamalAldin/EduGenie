const Student = require("../../models/student/student");
const Teacher = require("../../models/teacher/teacher");
const Course = require("../../models/teacher/course");
const Chapter = require("../../models/teacher/chapter");
const mongoose = require("mongoose");

exports.requestEnrollment = async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user.id; // Assuming req.user contains the authenticated student's ID

  try {
    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Check if the student is already enrolled
    if (course.students.includes(studentId)) {
      return res
        .status(400)
        .json({ message: "You are already enrolled in this course." });
    }

    // Check if the student has already requested enrollment
    const existingRequest = course.pendingStudents.find(
      (entry) => entry.student.toString() === studentId
    );
    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "You have already requested enrollment." });
    }

    // Add the student's request to the pendingStudents array
    course.pendingStudents.push({ student: studentId });
    await course.save();

    res.status(200).json({
      message: "Enrollment request submitted successfully.",
    });
  } catch (error) {
    console.error("Error requesting enrollment:", error.message || error);
    res.status(500).json({
      message: "An error occurred while requesting enrollment.",
    });
  }
};
