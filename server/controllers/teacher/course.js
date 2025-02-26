const Teacher = require("../../models/teacher/teacher");
const Student = require("../../models/student/student");
const Course = require("../../models/teacher/course");
const Chapter = require("../../models/teacher/chapter");
const mongoose = require("mongoose");

exports.createCourse = async (req, res) => {
  const { courseCode, name } = req.body;
  const teacherId = req.user.id; // Assuming req.user contains authenticated teacher info
  console.log("course user id: ", teacherId);

  // Validate request body
  if (
    !courseCode ||
    typeof courseCode !== "string" ||
    !name ||
    typeof name !== "string"
  ) {
    return res
      .status(422)
      .json({ message: "Valid course code and name are required." });
  }

  try {
    // Check if the teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    // Create a new course
    const course = new Course({
      courseCode,
      name,
      teacher: teacherId, // Reference the teacher in the course schema
    });

    // Save the course to the database
    const savedCourse = await course.save();

    // Add the course to the teacher's `courses` field
    teacher.courses.push(savedCourse._id);
    await teacher.save();

    // Respond with the created course
    return res.status(201).json({
      message: "Course created successfully.",
      course: {
        id: savedCourse._id,
        courseCode: savedCourse.courseCode,
        name: savedCourse.name,
        teacher: savedCourse.teacher,
      },
    });
  } catch (err) {
    console.error("Error creating course:", err);

    // Handle specific MongoDB errors
    if (err.code === 11000) {
      return res.status(409).json({ message: "Course code must be unique." });
    }

    // Generic server error
    return res
      .status(500)
      .json({ message: "Failed to create course.", error: err.message });
  }
};

exports.getCourses = async (req, res) => {
  const userId = req.user.id; // Assuming req.user contains the authenticated teacher's ID
  const userRole = req.user.role;

  try {
    var courses = "No courses found.";
    // Fetch courses belonging to the authenticated teacher
    if (userRole == "teacher") {
      var courses = await Course.find({ teacher: userId });
    } else if (userRole == "student") {
      var courses = await Course.find({ students: userId });
    }

    return res.status(200).json({
      courses: courses,
    });
  } catch (err) {
    console.error("Error fetching courses:", err.message);
    return res
      .status(500)
      .json({ message: "Failed to fetch courses.", error: err.message });
  }
};

exports.updateCourse = (req, res) => {
  const { id } = req.params;
  console.log(id);
  const { courseCode, name } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid course ID." });
  }

  if (!courseCode || !name) {
    return res.status(422).json({ message: "Code and name are required." });
  }

  Course.findByIdAndUpdate(
    id,
    { courseCode, name },
    { new: true, runValidators: true }
  )
    .then((updatedCourse) => {
      if (!updatedCourse) {
        return res.status(404).json({ message: "Course not found." });
      }
      res.status(200).json({
        message: "Course updated successfully.",
        course: updatedCourse,
      });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ message: "Failed to update course.", error: err.message });
    });
};

// Delete a course by ID
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid course ID." });
  }

  try {
    // Find the course
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Delete related chapters by the `course` field
    await Chapter.deleteMany({ course: id });

    // Delete the course
    const deletedCourse = await Course.findByIdAndDelete(id);

    res.status(200).json({
      message: "Course and associated chapters deleted successfully.",
      course: deletedCourse,
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      message: "Failed to delete course.",
      error: error.message,
    });
  }
};

exports.enrollStudent = async (req, res) => {
  const { courseId } = req.params;
  const { username } = req.body;
  const teacherId = req.user.id; // Assuming req.user contains the authenticated teacher info

  try {
    // Verify course ownership
    const course = await Course.findOne({ _id: courseId, teacher: teacherId });
    if (!course) {
      return res
        .status(403)
        .json({ message: "Access denied: You do not own this course." });
    }

    // Find the student by username
    const student = await Student.findOne({ username });
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Check if the student is already enrolled
    if (course.students.includes(student._id)) {
      return res
        .status(400)
        .json({ message: "Student is already enrolled in this course." });
    }

    // Add the student directly to the course's students array
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      course.students.push(student._id);
      student.courses.push(course._id);

      await course.save({ session });
      await student.save({ session });

      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }

    // Populate response with updated students
    const updatedCourse = await Course.findById(courseId).populate(
      "students",
      "username email firstName lastName"
    );

    res.status(200).json({
      message: `Student ${student.username} successfully enrolled in the course ${course.name}.`,
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error enrolling student:", error.message || error);
    res.status(500).json({
      message: "An error occurred while enrolling the student.",
    });
  }
};

exports.approveEnrollment = async (req, res) => {
  const { courseId, studentId } = req.params;
  const teacherId = req.user.id; // Assuming req.user contains the authenticated teacher's ID

  try {
    // Verify course ownership
    const course = await Course.findOne({ _id: courseId, teacher: teacherId });
    if (!course) {
      return res
        .status(403)
        .json({ message: "Access denied: You do not own this course." });
    }

    // Find the pending request for the student
    const requestIndex = course.pendingStudents.findIndex(
      (entry) => entry.student.toString() === studentId
    );
    if (requestIndex === -1) {
      return res.status(404).json({ message: "Enrollment request not found." });
    }

    // Approve the enrollment request
    course.students.push(studentId);
    course.pendingStudents.splice(requestIndex, 1); // Remove the request
    await course.save();

    // Add the course to the student's courses array
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }
    student.courses.push(courseId);
    await student.save();

    res.status(200).json({
      message: `Student ${student.username} has been enrolled successfully.`,
    });
  } catch (error) {
    console.error("Error approving enrollment:", error.message || error);
    res.status(500).json({
      message: "An error occurred while approving enrollment.",
    });
  }
};

exports.getPendingEnrollments = async (req, res) => {
  const { courseId } = req.params;
  const teacherId = req.user.id; // Assuming req.user contains the authenticated teacher info

  try {
    // Verify course ownership
    const course = await Course.findOne({ _id: courseId, teacher: teacherId })
      .populate("pendingStudents.student", "username email firstName lastName") // Populate student details
      .exec();
    if (!course) {
      return res
        .status(403)
        .json({ message: "Access denied: You do not own this course." });
    }

    // Extract pending students
    const pendingStudents = course.pendingStudents.filter(
      (enrollment) => enrollment.status === "pending"
    );

    res.status(200).json({
      message: "Pending enrollment requests retrieved successfully.",
      pendingStudents,
    });
  } catch (error) {
    console.error(
      "Error fetching pending enrollments:",
      error.message || error
    );
    res.status(500).json({
      message: "An error occurred while fetching pending enrollments.",
    });
  }
};

exports.getEnrolledStudents = async (req, res) => {
  const { courseId } = req.params;
  const teacherId = req.user.id; // Assuming req.user contains the authenticated teacher info

  try {
    // Verify that the teacher owns the course
    const course = await Course.findOne({
      _id: courseId,
      teacher: teacherId,
    }).populate("students", "username firstName lastName");
    if (!course) {
      return res
        .status(403)
        .json({ message: "Access denied: You do not own this course." });
    }

    // Fetch the enrolled students
    const enrolledStudents = course.students;

    res.status(200).json({
      message: `Students enrolled in course ${course.name}.`,
      students: enrolledStudents,
    });
  } catch (error) {
    console.error("Error fetching enrolled students:", error.message || error);
    res.status(500).json({
      message: "An error occurred while fetching the enrolled students.",
    });
  }
};

exports.removeStudent = async (req, res) => {
  const { courseId } = req.params;
  const { studentId } = req.body; // Assuming studentId is sent in the request body
  const teacherId = req.user.id; // Assuming req.user contains the authenticated teacher info

  try {
    // Verify course ownership
    const course = await Course.findOne({ _id: courseId, teacher: teacherId });
    if (!course) {
      return res
        .status(403)
        .json({ message: "Access denied: You do not own this course." });
    }

    // Find the student by ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Check if the student is enrolled in the course
    if (!course.students.includes(student._id)) {
      return res
        .status(400)
        .json({ message: "Student is not enrolled in this course." });
    }

    // Remove the student from the course and the course from the student's courses
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Remove student from the course's student array
      course.students = course.students.filter(
        (id) => id.toString() !== student._id.toString()
      );

      // Remove course from the student's courses array
      student.courses = student.courses.filter(
        (id) => id.toString() !== course._id.toString()
      );

      // Save changes
      await course.save({ session });
      await student.save({ session });

      // Commit transaction
      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }

    // Populate response with updated students
    const updatedCourse = await Course.findById(courseId).populate(
      "students",
      "username email firstName lastName"
    );

    res.status(200).json({
      message: `Student ${student.username} successfully removed from the course ${course.name}.`,
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error removing student:", error.message || error);
    res.status(500).json({
      message: "An error occurred while removing the student.",
    });
  }
};
