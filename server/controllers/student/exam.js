const { OpenAI } = require("openai");
const { extractTextFromPdf } = require("./extract");
const path = require("path");
const prompts = require("./prompts");
const Exam = require("../../models/teacher/exam");
const ExamResult = require("../../models/student/examResult");
const Course = require("../../models/teacher/course");
const moment = require("moment-timezone");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.getExams = async (req, res) => {
  const { courseId } = req.params;
  const teacherId = req.user.id; // Assuming req.user contains the authenticated teacher's ID

  try {
    // Check if the course exists and belongs to the teacher
    const course = await Course.findOne({ _id: courseId, teacher: teacherId });
    if (!course) {
      return res
        .status(403)
        .json({ message: "Access denied: You do not own this course." });
    }

    // Fetch exams for the specified course
    const exams = await Exam.find({ course: courseId });

    // Return exams
    return res.status(200).json(exams);
  } catch (err) {
    console.error("Error fetching exams:", err.message || err);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching exams." });
  }
};

exports.getExam = async (req, res) => {
  const { courseId, examId } = req.params; // Extract courseId and examId from params
  const studentId = req.user.id; // Assume req.user contains the authenticated student's ID

  try {
    // Check if the course exists and the student is enrolled
    const course = await Course.findOne({
      _id: courseId,
      students: studentId,
    });
    if (!course) {
      return res.status(403).json({
        message: "Access denied: You are not enrolled in this course.",
      });
    }

    // Check if the student has already submitted this exam
    const existingExamResult = await ExamResult.findOne({
      exam: examId,
      student: studentId,
    });

    if (existingExamResult) {
      return res.status(403).json({
        message: "Access denied: You have already submitted this exam.",
      });
    }

    // Find the exam associated with the course
    const exam = await Exam.findOne({ _id: examId, course: courseId }).lean(); // `lean` makes the result a plain JavaScript object
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    // Check if the current time is within the exam period
    const now = new Date();
    if (now < exam.scheduledDateTime || now > exam.endTime) {
      return res.status(403).json({
        message: "Access denied: The exam is not available at this time.",
      });
    }

    // Exclude `model_answer` and `grading_criteria` fields
    exam.sections = exam.sections.map((section) => ({
      ...section,
      questions: section.questions.map(
        ({ model_answer, grading_criteria, ...rest }) => rest
      ),
    }));

    // Respond with the filtered exam
    return res.status(200).json(exam);
  } catch (err) {
    console.error("Error fetching exam:", err.message || err);
    return res.status(500).json({ message: "Error fetching exam." });
  }
};

// Get Upcoming Exams
exports.getUpcomingExams = async (req, res) => {
  const studentId = req.user.id; // Authenticated student's ID

  try {
    const now = moment().utc().toDate(); // Current UTC time

    // Find courses the student is enrolled in
    const studentCourses = await Course.find({ students: studentId }).select(
      "_id name"
    );
    if (!studentCourses || studentCourses.length === 0) {
      return res
        .status(404)
        .json({ message: "You are not enrolled in any courses." });
    }

    const courseIds = studentCourses.map((course) => course._id);

    // Find exams that are scheduled, are ongoing, or are in the future
    const exams = await Exam.find({
      isScheduled: true,
      $or: [
        { scheduledDateTime: { $gte: now } }, // Exams scheduled in the future
        { scheduledDateTime: { $lte: now }, endTime: { $gte: now } }, // Ongoing exams
      ],
      course: { $in: courseIds }, // Exams belonging to the student's courses
    })
      .populate("course", "name _id") // Populate course name from the Course model
      .sort({ scheduledDateTime: 1 }); // Sort by start time

    if (!exams || exams.length === 0) {
      return res.status(404).json({
        message:
          "No upcoming or ongoing exams found for your enrolled courses.",
      });
    }

    // Format the response
    const formattedExams = exams.map((exam) => ({
      _id: exam._id,
      courseId: exam.course._id,
      course: exam.course.name,
      examType: exam.exam_type,
      date: moment(exam.scheduledDateTime)
        .tz("Africa/Cairo")
        .format("YYYY-MM-DD"),
      time: moment(exam.scheduledDateTime).tz("Africa/Cairo").format("HH:mm"),
      duration: `${Math.floor(exam.duration / 60)}h ${exam.duration % 60}m`,
    }));

    res.status(200).json({ exams: formattedExams });
  } catch (error) {
    console.error("Error fetching upcoming exams:", error.message || error);
    res
      .status(500)
      .json({ message: "An error occurred.", error: error.message });
  }
};

exports.getExamResult = async (req, res) => {
  try {
    const { examId } = req.params;
    const studentId = req.user.id; // Assuming the student is authenticated and their ID is in req.user

    // Step 1: Fetch the exam details
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    // Step 2: Check if the current time is past the exam's endTime
    const now = moment().utc();
    if (moment(exam.endTime).isAfter(now)) {
      return res.status(403).json({
        message:
          "Results are not yet available. Please wait until the exam ends.",
      });
    }

    // Step 3: Fetch the ExamResult for the student
    const examResult = await ExamResult.findOne({
      exam: examId,
      student: studentId,
    });

    if (!examResult) {
      return res.status(404).json({ message: "Exam result not found." });
    }

    // Step 4: Return the ExamResult
    res.status(200).json({
      success: true,
      data: examResult,
    });
  } catch (error) {
    console.error("Error fetching exam result:", error.message || error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the exam result.",
    });
  }
};

exports.getStudentExamResult = async (req, res) => {
  try {
    const { examId } = req.params;
    const studentId = req.user.id; // Get student ID from the authenticated user

    // Step 1: Fetch the exam to verify it exists
    const exam = await Exam.findById(examId).populate("course");
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    // Step 2: Verify that the student is enrolled in the course
    if (!exam.course.students.includes(studentId)) {
      return res.status(403).json({
        message: "Access denied: You are not enrolled in this course.",
      });
    }

    // Step 3: Check if the exam end time has passed
    const currentTime = new Date();
    if (exam.endTime > currentTime) {
      return res.status(403).json({
        message:
          "Exam results are not available yet. Please check after the exam end time.",
        exam_end_time: exam.endTime,
      });
    }

    // Step 4: Fetch student's exam result and populate student details
    const examResult = await ExamResult.findOne({
      exam: examId,
      student: studentId,
    })
      .populate("student", "firstName lastName") // Get student's first and last name
      .lean();

    if (!examResult) {
      return res
        .status(404)
        .json({ message: "No result found for this exam." });
    }

    // Step 5: Construct the response
    res.status(200).json({
      success: true,
      student: {
        firstName: examResult.student.firstName,
        lastName: examResult.student.lastName,
      },
      courseName: exam.course.name,
      examType: exam.exam_type,
      total_score: examResult.total_score,
      max_score: examResult.max_score,
      sections: examResult.sections, // Include the sections with evaluations
    });
  } catch (error) {
    console.error(
      "Error fetching student exam result:",
      error.message || error
    );
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the exam result.",
    });
  }
};

exports.getStudentExamResults = async (req, res) => {
  try {
    const studentId = req.user.id; // Get the authenticated student ID

    // Step 1: Fetch all exam results for the student
    const examResults = await ExamResult.find({ student: studentId })
      .populate({
        path: "exam",
        select: "exam_topic exam_type scheduledDateTime endTime course",
        populate: { path: "course", select: "name" },
      })
      .lean();

    if (!examResults || examResults.length === 0) {
      return res.status(404).json({ message: "No exam results found." });
    }

    // Step 2: Check if the exam end time has passed before showing results
    const currentTime = new Date();

    const availableResults = examResults.filter((result) => {
      return (
        result.exam.endTime && new Date(result.exam.endTime) <= currentTime
      );
    });

    if (availableResults.length === 0) {
      return res.status(403).json({
        message:
          "Exam results are not available yet. Please check after the exam end time.",
      });
    }

    // Step 3: Construct response for available exam results only
    const formattedResults = availableResults.map((result) => ({
      exam_id: result.exam._id,
      exam_topic: result.exam.exam_topic,
      exam_type: result.exam.exam_type,
      exam_date: result.exam.scheduledDateTime,
      course_name: result.exam.course.name,
      total_score: result.total_score,
      max_score: result.max_score,
      sections: result.sections, // Include the sections with evaluations
    }));

    res.status(200).json({
      success: true,
      results: formattedResults,
    });
  } catch (error) {
    console.error(
      "Error fetching student exam results:",
      error.message || error
    );
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the exam results.",
    });
  }
};

// exports.cancelExamDueToCheating = async (req, res) => {
//   try {
//     const { examId, studentId } = req.params;
//     const reason = req.body.message;
//     console.log(req.body);

//     if (!reason || typeof reason !== "string" || reason.trim() === "") {
//       return res
//         .status(400)
//         .json({ message: "Reason for cancellation is required." });
//     }

//     // Check if an exam result already exists
//     const existingExamResult = await ExamResult.findOne({
//       exam: examId,
//       student: studentId,
//     });

//     if (existingExamResult) {
//       return res.status(400).json({
//         message: "Exam result already exists. You cannot create a new one.",
//       });
//     }

//     // Create a new exam result with empty fields except for cheated field
//     const newExamResult = new ExamResult({
//       exam: examId,
//       student: studentId,
//       sections: [], // Empty sections
//       total_score: 0,
//       max_score: 0,
//       cheated: {
//         cheated: true,
//         reason: reason,
//       },
//     });

//     await newExamResult.save();

//     res.status(201).json({
//       success: true,
//       message: "Exam has been canceled due to cheating.",
//       examResult: newExamResult,
//     });
//   } catch (error) {
//     console.error(
//       "Error canceling exam due to cheating:",
//       error.message || error
//     );
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while canceling the exam.",
//     });
//   }
// };

exports.cancelExamDueToCheating = async (req, res) => {
  try {
    const { examId, studentId } = req.params;
    const reason = req.body.message;

    if (!reason || typeof reason !== "string" || reason.trim() === "") {
      return res
        .status(400)
        .json({ message: "Reason for cancellation is required." });
    }

    // Check if an exam result already exists
    const existingExamResult = await ExamResult.findOne({
      exam: examId,
      student: studentId,
    });

    if (existingExamResult) {
      // Check if the cheating record already exists
      if (existingExamResult.cheated && existingExamResult.cheated.cheated) {
        return res.status(200).json({
          success: true,
          message: "Exam has already been canceled due to cheating.",
          examResult: existingExamResult,
        });
      }

      // Update the existing record with cheating info
      existingExamResult.cheated = {
        cheated: true,
        reason: reason,
      };

      await existingExamResult.save();

      return res.status(200).json({
        success: true,
        message: "Exam has been marked as canceled due to cheating.",
        examResult: existingExamResult,
      });
    }

    // Create a new exam result with cheating flag
    const newExamResult = new ExamResult({
      exam: examId,
      student: studentId,
      sections: [], // Empty sections
      total_score: 0,
      max_score: 0,
      cheated: { cheated: true, reason: reason },
    });

    await newExamResult.save();

    return res.status(201).json({
      success: true,
      message: "Exam has been canceled due to cheating.",
      examResult: newExamResult,
    });
  } catch (error) {
    console.error("Error canceling exam due to cheating:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while canceling the exam.",
    });
  }
};

exports.getCheatingStatus = async (req, res) => {
  try {
    const { examId, studentId } = req.params;

    // Find the exam result for the student
    const examResult = await ExamResult.findOne({
      exam: examId,
      student: studentId,
    })
      .select("cheated")
      .lean();

    if (!examResult) {
      return res
        .status(404)
        .json({ message: "Exam result not found for this student." });
    }

    console.log(examResult.cheated);
    res.status(200).json({
      success: true,
      cheated: examResult.cheated || {
        cheated: false,
        reason: "No cheating reported.",
      },
    });
  } catch (error) {
    console.error("Error fetching cheating status:", error.message || error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the cheating status.",
    });
  }
};
