const { OpenAI } = require("openai");
const { extractTextFromPdf } = require("./extract");
const path = require("path");
const prompts = require("./prompts");
const Exam = require("../../models/teacher/exam");
const Course = require("../../models/teacher/course");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// exports.generateExam = async (req, res) => {
//   const prompt_start = prompts.generateExamPrompt;
//   const { chapter, sections } = req.body;
//   const prompt_end = prompt_start(chapter, sections);
//   const uploads = path.join(__dirname, "..", "..", "uploads");
//   const chapterPath = `${uploads}/${chapter}.pdf`; // Path to the uploaded PDF file

//   try {
//     // Extract text from the PDF
//     const content = await extractTextFromPdf(chapterPath);

//     const prompt = `${prompt_end} here is the provided content\n${content}`;

//     // Generate exam questions using OpenAI API
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: "You are an examiner" },
//         { role: "user", content: prompt },
//       ],
//     });

//     // Remove backticks and extra newlines before parsing JSON
//     let rawData = response.choices[0].message.content;

//     // Remove the triple backticks and any extra surrounding spaces
//     rawData = rawData.replace(/^```json|```$/g, "").trim();

//     // Parse the response as JSON
//     let parsedExamData;
//     try {
//       parsedExamData = JSON.parse(rawData);
//       console.log(JSON.stringify(parsedExamData, null, 2));
//     } catch (error) {
//       console.error("Error parsing OpenAI response:", error);
//       return res.status(500).json({
//         success: false,
//         message: "OpenAI response is not valid JSON.",
//         error: error.message,
//       });
//     }

//     const exam = new Exam(parsedExamData);

//     exam
//       .save()
//       .then(() => console.log("Exam saved successfully!"))
//       .catch((err) => console.error("Error saving exam:", err));

//     // Send the response back to the client
//     return res.status(200).json({
//       success: true,
//       data: parsedExamData, // Return the parsed data
//     });
//   } catch (error) {
//     // Handle errors
//     console.error("Error generating exam:", error);
//     return res.status(500).json({
//       success: false,
//       message: "An error occurred while generating the exam.",
//       error: error.message,
//     });
//   }
// };

exports.generateExam = async (req, res) => {
  const { chapter, sections, courseId } = req.body;

  const prompt_start = prompts.generateExamPrompt;
  const prompt_end = prompt_start(chapter, sections);

  const uploads = path.join(__dirname, "..", "..", "uploads");
  const chapterPath = path.resolve(uploads, `${chapter}`); // Path to the uploaded PDF file

  try {
    // Extract text from the PDF
    const content = await extractTextFromPdf(chapterPath);

    const prompt = `${prompt_end} here is the provided content\n${content}`;

    // Generate exam questions using OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an examiner" },
        { role: "user", content: prompt },
      ],
    });

    // Validate and parse OpenAI response
    if (!response.choices || !response.choices[0]?.message?.content) {
      return res.status(500).json({
        success: false,
        message: "Invalid response from OpenAI.",
      });
    }

    let rawData = response.choices[0].message.content;

    // Clean up response
    rawData = rawData.replace(/^```json|```$/g, "").trim();

    let parsedExamData;
    try {
      parsedExamData = JSON.parse(rawData);
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      return res.status(500).json({
        success: false,
        message: "OpenAI response is not valid JSON.",
        error: error.message,
      });
    }

    // Add course reference to the exam data
    const examData = {
      ...parsedExamData,
      course: courseId,
    };

    // Create and save the exam
    const exam = new Exam(examData);
    const savedExam = await exam.save();

    // Update the course to include the new exam
    await Course.findByIdAndUpdate(courseId, {
      $push: { exams: savedExam._id },
    });

    // Send success response
    return res.status(201).json({
      success: true,
      data: savedExam,
    });
  } catch (error) {
    console.error("Error generating exam:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while generating the exam.",
      error: error.message,
    });
  }
};

// exports.generateExam = async (req, res) => {
//   const { chapter, sections, courseId } = req.body;

//   const uploads = path.join(__dirname, "..", "..", "uploads");
//   const chapterPath = path.resolve(uploads, `${chapter}`);

//   try {
//     // Validate courseId
//     if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or missing course ID.",
//       });
//     }

//     // Check if course exists
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({
//         success: false,
//         message: "Course not found.",
//       });
//     }

//     // Validate chapter file existence
//     if (!fs.existsSync(chapterPath)) {
//       return res.status(404).json({
//         success: false,
//         message: `File not found: ${chapterPath}`,
//       });
//     }

//     // Extract text from the PDF
//     const content = await extractTextFromPdf(chapterPath);

//     // Prepare the OpenAI prompt
//     const prompt_start = prompts.generateExamPrompt;
//     const prompt_end = prompt_start(chapter, sections);
//     const prompt = `${prompt_end} here is the provided content\n${content}`;

//     // Call OpenAI API
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: "You are an examiner" },
//         { role: "user", content: prompt },
//       ],
//     });

//     // Validate OpenAI response
//     if (!response.choices || !response.choices[0]?.message?.content) {
//       console.error("Invalid OpenAI response:", response);
//       return res.status(500).json({
//         success: false,
//         message: "Invalid response from OpenAI.",
//       });
//     }

//     // Parse OpenAI response
//     let rawData = response.choices[0].message.content;
//     rawData = rawData.replace(/^```json|```$/g, "").trim();

//     let parsedExamData;
//     try {
//       parsedExamData = JSON.parse(rawData);
//     } catch (error) {
//       console.error("Error parsing OpenAI response:", error);
//       return res.status(500).json({
//         success: false,
//         message: "OpenAI response is not valid JSON.",
//         error: error.message,
//       });
//     }

//     // Validate exam data
//     if (!parsedExamData.exam_topic || !parsedExamData.sections) {
//       return res.status(400).json({
//         success: false,
//         message: "Generated exam data is incomplete.",
//       });
//     }

//     // Add course reference to the exam data
//     const examData = {
//       ...parsedExamData,
//       course: courseId,
//     };

//     // Save the exam
//     const exam = new Exam(examData);
//     const savedExam = await exam.save();

//     // Update the course with the new exam
//     await Course.findByIdAndUpdate(
//       courseId,
//       { $push: { exams: savedExam._id } },
//       { new: true }
//     );

//     return res.status(201).json({
//       success: true,
//       data: savedExam,
//     });
//   } catch (error) {
//     console.error("Error generating exam:", error);
//     return res.status(500).json({
//       success: false,
//       message: "An error occurred while generating the exam.",
//       error: error.message,
//     });
//   }
// };

exports.getExams = (req, res) => {
  const { courseId } = req.params;

  Exam.find({ course: courseId }) // Filter exams by courseId
    .then((exams) => {
      if (exams.length === 0) {
        return res
          .status(404)
          .json({ message: "No exams found for this course." });
      }
      res.status(200).json(exams);
    })
    .catch((err) => {
      console.error("Error fetching exams:", err);
      res.status(500).json({ message: "Error fetching exams." });
    });
};

exports.getExam = (req, res) => {
  const { courseId, examId } = req.params; // Extract courseId and examId from params

  Exam.findOne({ _id: examId, course: courseId }) // Find the exam by examId and courseId
    .then((exam) => {
      if (!exam) {
        return res.status(404).json({ message: "Exam not found." });
      }
      res.status(200).json(exam); // Respond with the specific exam
    })
    .catch((err) => {
      console.error("Error fetching exam:", err);
      res.status(500).json({ message: "Error fetching exam." });
    });
};

exports.getAnswer = (req, res) => {
  const studentAnswer =
    "The PACT framework consists of four essential components: People, Activities, Contexts, and Technologies. People refer to the users and their characteristics, such as skills and needs. Activities focus on the tasks users aim to achieve. Contexts address the environment and circumstances in which these tasks are performed, including physical, social, and organizational settings. Technologies encompass the tools and systems available to support the activities. This framework is significant because it ensures that interactive systems are user-centered, efficient, and adaptive by considering the interplay between these elements in real-world applications.";
  let question;
  let model_answer;
  let grading_criteria;
  Exam.findOne({ _id: "67594dc696ee78eefef9cfd4" })
    .then((exam) => {
      question = exam.sections[0].questions[0].question;
      model_answer = exam.sections[0].questions[0].model_answer;
      grading_criteria = exam.sections[0].questions[0].grading_criteria;
      const prompt = prompts.correctExamPrompt(
        question,
        model_answer,
        studentAnswer,
        grading_criteria
      );
      console.log(prompt);
      res.json({
        question: question,
        model_answer: model_answer,
        student_answer: studentAnswer,
        grading_criteria: grading_criteria,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "An error occurred" });
    });
};

exports.correctExam = async (req, res, next) => {
  const studentAnswer = `The PACT framework consists of four key elements: People, Activities, Contexts, and Technologies. This framework is significant in interactive systems design as it emphasizes the interplay between these elements. Designers must understand the characteristics and needs of the users (People), the tasks they aim to accomplish (Activities), the environments in which these tasks take place (Contexts), and the technological resources available (Technologies). Recognizing this interaction helps in creating systems that are user-centered, efficient, and adaptive to real-world scenarios.`;

  try {
    // Step 1: Fetch exam data from the database
    const exam = await Exam.findOne({ _id: "67594dc696ee78eefef9cfd4" });

    if (!exam) {
      return res
        .status(404)
        .json({ success: false, message: "Exam not found" });
    }

    const question = exam.sections[0].questions[0].question;
    const model_answer = exam.sections[0].questions[0].model_answer;
    const grading_criteria = exam.sections[0].questions[0].grading_criteria;

    // Step 2: Create the prompt for OpenAI
    const prompt = prompts.correctExamPrompt(
      question,
      model_answer,
      studentAnswer,
      grading_criteria
    );

    // Step 3: Send request to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an exam grader." },
        { role: "user", content: prompt },
      ],
    });

    const evaluation = response.choices[0].message.content;
    const parsedData = JSON.parse(evaluation);

    // Step 4: Respond with the evaluation
    res.status(200).json({
      success: true,
      evaluation: parsedData,
    });
  } catch (error) {
    console.error("Error in correctExam:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while grading the exam.",
      error: error.message,
    });
  }
};

exports.deleteExam = async (req, res) => {
  const { courseId, examId } = req.params;

  try {
    // Find the exam to ensure it exists
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    // Ensure the exam belongs to the specified course
    if (exam.course.toString() !== courseId) {
      return res
        .status(403)
        .json({ message: "Exam does not belong to this course." });
    }

    // Remove the exam from the course's exams array
    await Course.findByIdAndUpdate(courseId, {
      $pull: { exams: examId },
    });

    // Delete the exam document from the database
    await Exam.findByIdAndDelete(examId);

    res.status(200).json({ message: "Exam deleted successfully." });
  } catch (error) {
    console.error("Error deleting exam:", error);
    res.status(500).json({ message: "Server error. Unable to delete exam." });
  }
};
