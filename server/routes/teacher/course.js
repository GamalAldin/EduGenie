const express = require('express');
const router = express.Router();

const courseController = require('../../controller/teacher/course');

// Get all courses
router.get('/courses', courseController.getCourses);

// Create a course
router.post('/course', courseController.createCourse);

// Edit course
router.put("/course/:id", courseController.updateCourse);

// Delete course
router.delete("/course/:id", courseController.deleteCourse);

module.exports = router;