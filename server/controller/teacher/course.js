const Course = require("../../models/teacher/course");
const Chapter = require("../../models/teacher/chapter");
const mongoose = require("mongoose");

// exports.createCourse = (req, res) => {
//   const { courseCode, name } = req.body;

//   if (!courseCode || !name) {
//     return res.status(422).json({ message: "Code and name are required." });
//   }

//   const course = new Course({ courseCode, name });

//   course
//     .save()
//     .then((savedCourse) => {
//       return res.status(201).json({
//         message: "Course created successfully.",
//         course: savedCourse,
//       });
//     })
//     .catch((err) => {
//       console.error(err);
//       return res
//         .status(500)
//         .json({ message: "Failed to create course.", error: err.message });
//     });
// };

exports.createCourse = async (req, res) => {
  const { courseCode, name } = req.body;

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
    // Create a new course
    const course = new Course({ courseCode, name });

    // Save the course to the database
    const savedCourse = await course.save();

    // Respond with the created course
    return res.status(201).json({
      message: "Course created successfully.",
      course: {
        id: savedCourse._id, // Include the id field explicitly
        courseCode: savedCourse.courseCode,
        name: savedCourse.name,
      },
    });
  } catch (err) {
    console.error("Error creating course:", err);

    // Handle duplicate course code error
    if (err.code === 11000) {
      return res.status(409).json({ message: "Course code must be unique." });
    }

    // Generic server error
    return res
      .status(500)
      .json({ message: "Failed to create course.", error: err.message });
  }
};


exports.getCourses = (req, res) => {
  Course.find()
    .then((courses) => {
      return res.status(200).json({
        courses: courses,
      });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Failed to create course.", error: err.message });
    });
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
