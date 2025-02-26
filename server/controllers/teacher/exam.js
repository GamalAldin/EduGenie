const { OpenAI } = require("openai");
const { extractTextFromPdf } = require("./extract");
const path = require("path");
const mongoose = require("mongoose");
const prompts = require("./prompts");
const Exam = require("../../models/teacher/exam");
const Course = require("../../models/teacher/course");
const StudentAnswer = require("../../models/student/studentAnswer");
const ExamResult = require("../../models/student/examResult");
const moment = require("moment-timezone");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const tiktoken = require("tiktoken");

function countTokens(text, model) {
  const encoding = tiktoken.encoding_for_model(model);
  const tokens = encoding.encode(text);
  return tokens.length;
}

const calculateQuestionsPerChapter = (sections, numChapters) => {
  return sections.map((section) => ({
    ...section,
    number: Math.ceil(section.number / numChapters), // Divide questions equally
  }));
};

// exports.generateExam = async (req, res) => {
//   const { chapters, sections, courseId } = req.body; // Accept an array of chapters
//   const teacherId = req.user.id; // Assuming req.user contains authenticated teacher info
//   console.log(req.body);

//   try {
//     // Verify course ownership
//     const course = await Course.findOne({ _id: courseId, teacher: teacherId });
//     if (!course) {
//       return res
//         .status(403)
//         .json({ message: "Access denied: You do not own this course." });
//     }

//     const uploads = path.join(__dirname, "..", "..", "uploads");
//     let combinedContent = "";

//     // Extract text from all chapters
//     for (const chapter of chapters) {
//       const chapterPath = path.resolve(uploads, `${chapter}`);
//       console.log(`Extracting text from: ${chapterPath}`);

//       try {
//         const content = await extractTextFromPdf(chapterPath);
//         combinedContent += `\n\nContent from ${chapter}:\n${content}`;
//       } catch (err) {
//         console.error(`Error extracting text from ${chapter}:`, err.message);
//         return res.status(500).json({
//           success: false,
//           message: `Failed to extract content from chapter ${chapter}.`,
//           error: err.message,
//         });
//       }
//     }

//     const prompt_start = prompts.generateExamPrompt;
//     const prompt_end = prompt_start(chapters.join(", "), sections);
//     const prompt = `${prompt_end} Here is the provided content:\n${combinedContent}`;

//     // Generate exam questions using OpenAI API
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: "You are an examiner" },
//         { role: "user", content: prompt },
//       ],
//     });

//     // Validate and parse OpenAI response
//     if (!response.choices || !response.choices[0]?.message?.content) {
//       return res.status(500).json({
//         success: false,
//         message: "Invalid response from OpenAI.",
//       });
//     }

//     let rawData = response.choices[0].message.content;
//     console.log(rawData);

//     // Clean up response
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

//     // Add course reference to the exam data
//     const examData = {
//       ...parsedExamData,
//       course: courseId,
//     };

//     // Create and save the exam
//     const exam = new Exam(examData);
//     const savedExam = await exam.save();

//     // Update the course to include the new exam
//     await Course.findByIdAndUpdate(courseId, {
//       $push: { exams: savedExam._id },
//     });

//     // Send success response
//     return res.status(201).json({
//       success: true,
//       data: savedExam,
//     });
//   } catch (error) {
//     console.error("Error generating exam:", error.message || error);
//     return res.status(500).json({
//       success: false,
//       message: "An error occurred while generating the exam.",
//       error: error.message,
//     });
//   }
// };

// generate exam 2
// exports.generateExam = async (req, res) => {
//   const { chapters, sections, courseId } = req.body; // Accept an array of chapters
//   const teacherId = req.user.id; // Assuming req.user contains authenticated teacher info
//   console.log(req.body);

//   try {
//     // Verify course ownership
//     const course = await Course.findOne({ _id: courseId, teacher: teacherId });
//     if (!course) {
//       return res
//         .status(403)
//         .json({ message: "Access denied: You do not own this course." });
//     }

//     const uploads = path.join(__dirname, "..", "..", "uploads");
//     let combinedContent = "";

//     // Extract text from all chapters
//     for (const chapter of chapters) {
//       const chapterPath = path.resolve(uploads, `${chapter}`);
//       console.log(`Extracting text from: ${chapterPath}`);

//       try {
//         const content = await extractTextFromPdf(chapterPath);
//         combinedContent += `\n\nContent from ${chapter}:\n${content}`;
//       } catch (err) {
//         console.error(`Error extracting text from ${chapter}:`, err.message);
//         return res.status(500).json({
//           success: false,
//           message: `Failed to extract content from chapter ${chapter}.`,
//           error: err.message,
//         });
//       }
//     }

//     const prompt_start = prompts.generateExamPrompt;
//     const prompt_end = prompt_start(chapters.join(", "), sections);
//     let prompt = `${prompt_end} Here is the provided content:\n${combinedContent}`;

//     // Function to send request to OpenAI
//     const getOpenAIResponse = async (prompt) => {
//       return await openai.chat.completions.create({
//         model: "gpt-4o",
//         messages: [
//           { role: "system", content: "You are an examiner" },
//           { role: "user", content: prompt },
//         ],
//       });
//     };

//     let response = await getOpenAIResponse(prompt);

//     // Validate and parse OpenAI response
//     if (!response.choices || !response.choices[0]?.message?.content) {
//       return res.status(500).json({
//         success: false,
//         message: "Invalid response from OpenAI.",
//       });
//     }

//     let rawData = response.choices[0].message.content;
//     console.log(rawData);

//     // Clean up response
//     rawData = rawData.replace(/^```json|```$/g, "").trim();

//     let parsedExamData;
//     try {
//       parsedExamData = JSON.parse(rawData);
//     } catch (error) {
//       console.error("Error parsing OpenAI response:", error);

//       // Resend request with a stricter JSON enforcement
//       console.log("Retrying with a strict JSON format prompt...");

//       const strictPrompt = `${prompt} \n\nEnsure the response is strictly in JSON format without any additional text. Respond with only valid JSON data.`;

//       response = await getOpenAIResponse(strictPrompt);

//       rawData = response.choices[0].message.content
//         .replace(/^```json|```$/g, "")
//         .trim();
//       try {
//         parsedExamData = JSON.parse(rawData);
//       } catch (retryError) {
//         console.error("Error parsing OpenAI response after retry:", retryError);
//         return res.status(500).json({
//           success: false,
//           message: "OpenAI response is not valid JSON even after retry.",
//           error: retryError.message,
//         });
//       }
//     }

//     // Add course reference to the exam data
//     const examData = {
//       ...parsedExamData,
//       course: courseId,
//     };

//     // Create and save the exam
//     const exam = new Exam(examData);
//     const savedExam = await exam.save();

//     // Update the course to include the new exam
//     await Course.findByIdAndUpdate(courseId, {
//       $push: { exams: savedExam._id },
//     });

//     // Send success response
//     return res.status(201).json({
//       success: true,
//       data: savedExam,
//     });
//   } catch (error) {
//     console.error("Error generating exam:", error.message || error);
//     return res.status(500).json({
//       success: false,
//       message: "An error occurred while generating the exam.",
//       error: error.message,
//     });
//   }
// };

exports.generateExam = async (req, res) => {
  const { chapters, sections, courseId } = req.body;
  const teacherId = req.user.id;

  try {
    // Verify course ownership
    const course = await Course.findOne({ _id: courseId, teacher: teacherId });
    if (!course) {
      return res
        .status(403)
        .json({ message: "Access denied: You do not own this course." });
    }

    const uploads = path.join(__dirname, "..", "..", "uploads");

    // Divide questions among chapters
    const questionsPerChapter = calculateQuestionsPerChapter(
      sections,
      chapters.length
    );

    // Function to send request to OpenAI
    const getOpenAIResponse = async (prompt) => {
      return await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an examiner" },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" }, // Ensure the response is in JSON format
        max_tokens: 4096, // Adjust as needed
      });
    };

    // Function to extract JSON from OpenAI response
    const extractJSONFromResponse = (response) => {
      const rawData = response.choices[0].message.content;
      console.log("Full OpenAI Response:", rawData);

      // Use a regular expression to extract JSON from the response
      const jsonMatch = rawData.match(/{[\s\S]*}/);
      if (jsonMatch) {
        return jsonMatch[0];
      }
      return null;
    };

    // Function to validate JSON
    const validateJSON = (jsonString) => {
      try {
        const parsedData = JSON.parse(jsonString);

        // Ensure required fields are present and valid
        if (
          !parsedData.exam_topic ||
          !parsedData.sections ||
          !Array.isArray(parsedData.sections)
        ) {
          throw new Error("Missing required fields: exam_topic or sections");
        }

        return true;
      } catch (error) {
        console.error("Invalid JSON:", error.message);
        return false;
      }
    };

    // Initialize an object to store merged sections
    const mergedSections = {};

    // Generate questions for each chapter
    for (const chapter of chapters) {
      const chapterPath = path.resolve(uploads, `${chapter}`);
      console.log(`Extracting text from: ${chapterPath}`);

      try {
        const content = await extractTextFromPdf(chapterPath);
        const prompt = prompts.generateExamPrompt(chapter, questionsPerChapter);
        const fullPrompt = `${prompt} Here is the provided content:\n${content}`;

        let retryCount = 0;
        const maxRetries = 1; // Retry only once
        let parsedChapterData;

        while (retryCount <= maxRetries) {
          try {
            const response = await getOpenAIResponse(fullPrompt);
            const jsonData = extractJSONFromResponse(response);

            if (jsonData && validateJSON(jsonData)) {
              parsedChapterData = JSON.parse(jsonData);

              // Merge questions into the corresponding sections
              for (const section of parsedChapterData.sections) {
                const sectionKey = `${section.section_title}_${section.questions_type}`;

                if (!mergedSections[sectionKey]) {
                  // Initialize the section if it doesn't exist
                  mergedSections[sectionKey] = {
                    section_number: section.section_number,
                    section_title: section.section_title,
                    questions_type: section.questions_type,
                    questions: [],
                  };
                }

                // Add questions to the section
                mergedSections[sectionKey].questions.push(...section.questions);
              }

              break; // Exit the loop if JSON is valid
            }
          } catch (error) {
            console.error(`Attempt ${retryCount + 1} failed:`, error.message);
            retryCount++;
          }
        }

        if (!parsedChapterData) {
          throw new Error("Failed to generate valid exam data after retries.");
        }
      } catch (err) {
        console.error(`Error extracting text from ${chapter}:`, err.message);
        return res.status(500).json({
          success: false,
          message: `Failed to extract content from chapter ${chapter}.`,
          error: err.message,
        });
      }
    }

    // Convert merged sections into an array
    const finalSections = Object.values(mergedSections);

    // Create the exam data
    const examData = {
      exam_topic: "Exam",
      sections: finalSections,
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
    console.error("Error generating exam:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while generating the exam.",
      error: error.message,
    });
  }
};

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
  const teacherId = req.user.id; // Assume req.user contains the authenticated teacher's ID

  try {
    // Check if the course exists and belongs to the authenticated teacher
    const course = await Course.findOne({ _id: courseId, teacher: teacherId });
    if (!course) {
      return res
        .status(403)
        .json({ message: "Access denied: You do not own this course." });
    }

    // Find the exam associated with the course
    const exam = await Exam.findOne({ _id: examId, course: courseId });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    // Respond with the specific exam
    return res.status(200).json(exam);
  } catch (err) {
    console.error("Error fetching exam:", err.message || err);
    return res.status(500).json({ message: "Error fetching exam." });
  }
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

const correctObjectiveQuestions = async ({ examId, studentId, answers }) => {
  console.log("Starting correctObjectiveQuestions...");

  const exam = await Exam.findById(examId);
  if (!exam) throw new Error("Exam not found.");

  const sections = exam.sections
    .filter((section) => section.questions_type !== "essay")
    .map((section) => {
      const sectionAnswers = answers.filter((answer) =>
        section.questions.some(
          (q) => q._id.toString() === answer.question_id.toString()
        )
      );

      const evaluations = sectionAnswers.map((studentAnswer) => {
        const question = section.questions.find(
          (q) => q._id.toString() === studentAnswer.question_id.toString()
        );

        if (!question) {
          return {
            question_id: "Unknown",
            question: "Unknown question",
            student_answer: studentAnswer.student_answer || "",
            total_score: 0,
            max_score: 0,
            breakdown: [],
          };
        }

        const isCorrect =
          (studentAnswer.student_answer || "").trim() ===
          (question.correct_answer || "").trim();
        const totalScore = isCorrect
          ? parseInt(question.full_mark ?? 0, 10)
          : 0;

        return {
          question_id: question._id,
          question: question.question,
          student_answer: studentAnswer.student_answer,
          total_score: totalScore,
          max_score: parseInt(question.full_mark ?? 0, 10),
          breakdown: [
            {
              criterion: `Correct Answer: ${question.correct_answer}`,
              points_awarded: totalScore,
              feedback: isCorrect
                ? "Correct answer."
                : `Incorrect. The correct answer is: ${question.correct_answer}`,
            },
          ],
        };
      });

      return {
        section_number: section.section_number, // Ensure section_number is set
        section_title: section.section_title,
        questions_type: section.questions_type,
        evaluations,
      };
    });

  const totalScore = sections.reduce(
    (sum, section) =>
      sum + section.evaluations.reduce((s, eval) => s + eval.total_score, 0),
    0
  );
  const maxScore = sections.reduce(
    (sum, section) =>
      sum + section.evaluations.reduce((s, eval) => s + eval.max_score, 0),
    0
  );

  return { sections, total_score: totalScore, max_score: maxScore };
};

const correctEssayQuestions = async (questionsWithAnswers) => {
  try {
    const prompt = prompts.correctExamPrompt(questionsWithAnswers);
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an intelligent grading assistant.",
        },
        { role: "user", content: prompt },
      ],
    });

    const rawData = response.choices[0]?.message?.content
      .replace(/^```json|```$/g, "")
      .trim();

    let parsedEvaluations;
    try {
      parsedEvaluations = JSON.parse(rawData);
    } catch (err) {
      console.error("Error parsing AI response:", err.message);
      throw new Error("Failed to process AI evaluation response.");
    }

    const sections = questionsWithAnswers.reduce((acc, question) => {
      const evaluation = parsedEvaluations.evaluations.find(
        (eval) => eval.question === question.question
      );
      if (!evaluation) return acc;

      const { section_number, section_title } = question;
      const section = acc.find((sec) => sec.section_number === section_number);

      if (section) {
        section.evaluations.push({
          question_id: question.question_id,
          question: evaluation.question,
          student_answer: evaluation.student_answer,
          total_score: evaluation.evaluation.total_score,
          max_score: evaluation.evaluation.max_score,
          breakdown: evaluation.evaluation.breakdown,
        });
      } else {
        acc.push({
          section_number: section_number || 0, // Ensure section_number is set
          section_title: section_title || "Unknown", // Ensure section_title is set
          questions_type: "essay",
          evaluations: [
            {
              question_id: question.question_id,
              question: evaluation.question,
              student_answer: evaluation.student_answer,
              total_score: evaluation.evaluation.total_score,
              max_score: evaluation.evaluation.max_score,
              breakdown: evaluation.evaluation.breakdown,
            },
          ],
        });
      }
      return acc;
    }, []);

    const totalScore = sections.reduce(
      (sum, section) =>
        sum + section.evaluations.reduce((s, eval) => s + eval.total_score, 0),
      0
    );

    const maxScore = sections.reduce(
      (sum, section) =>
        sum + section.evaluations.reduce((s, eval) => s + eval.max_score, 0),
      0
    );

    return { sections, total_score: totalScore, max_score: maxScore };
  } catch (error) {
    console.error("Error in correctEssayQuestions:", error.message || error);
    throw error;
  }
};

exports.correctExam = async ({ examId, studentId }) => {
  try {
    console.log("Starting correctExam...");

    // Fetch the exam
    const exam = await Exam.findById(examId);
    if (!exam) throw new Error("Exam not found.");
    console.log("Exam fetched:", exam);

    // Fetch the ExamResult
    const examResult = await ExamResult.findOne({
      exam: examId,
      student: studentId,
    });
    if (!examResult) throw new Error("ExamResult not found.");
    console.log("ExamResult fetched:", examResult);

    // Flatten all student answers from sections
    const studentAnswers = examResult.sections.flatMap((section) => {
      if (!section.evaluations || !Array.isArray(section.evaluations)) {
        console.error("Invalid section structure:", section);
        return [];
      }
      return section.evaluations.map((q) => ({
        question_id: q.question_id,
        student_answer: q.student_answer,
      }));
    });

    console.log("Student Answers:", studentAnswers);

    // Separate objective and essay questions
    const objectiveSections = exam.sections.filter(
      (section) => section.questions_type !== "essay"
    );

    const essaySections = exam.sections.filter(
      (section) => section.questions_type === "essay"
    );

    const objectiveQuestions = objectiveSections.flatMap(
      (section) => section.questions
    );
    const essayQuestions = essaySections.flatMap(
      (section) => section.questions
    );

    console.log("Objective Questions:", objectiveQuestions);
    console.log("Essay Questions:", essayQuestions);

    // Correct objective questions
    let objectiveResults = { sections: [], total_score: 0, max_score: 0 };
    if (objectiveQuestions.length > 0) {
      objectiveResults = await correctObjectiveQuestions({
        examId,
        studentId,
        answers: studentAnswers.filter((ans) =>
          objectiveQuestions.some(
            (q) => q._id.toString() === ans.question_id.toString()
          )
        ),
      });
    }

    // Correct essay questions
    let essayResults = { sections: [], total_score: 0, max_score: 0 };
    if (essayQuestions.length > 0) {
      essayResults = await correctEssayQuestions(
        studentAnswers
          .filter((ans) =>
            essayQuestions.some(
              (q) => q._id.toString() === ans.question_id.toString()
            )
          )
          .map((ans) => {
            const question = essayQuestions.find(
              (q) => q._id.toString() === ans.question_id.toString()
            );
            if (!question) {
              console.error(
                `Question not found for question_id: ${ans.question_id}`
              );
              return null;
            }

            // Find the section details by matching the essay question to the correct section
            const section = essaySections.find((sec) =>
              sec.questions.some(
                (q) => q._id.toString() === question._id.toString()
              )
            );

            return {
              section_number: section?.section_number || 0, // Get correct section number
              section_title: section?.section_title || "Untitled",
              question_id: question._id,
              question: question.question,
              model_answer: question.model_answer,
              student_answer: ans.student_answer,
              grading_criteria: question.grading_criteria || [],
            };
          })
          .filter((ans) => ans !== null)
      );
    }

    // Combine results
    const totalEvaluations = [
      ...objectiveResults.sections,
      ...essayResults.sections,
    ];

    // Sort sections based on section_number
    totalEvaluations.sort((a, b) => a.section_number - b.section_number);

    const totalScore = objectiveResults.total_score + essayResults.total_score;
    const maxScore = objectiveResults.max_score + essayResults.max_score;

    // Update ExamResult with sorted corrected evaluations
    examResult.sections = totalEvaluations.map((section) => ({
      section_number: section.section_number || 0, // Ensure section_number is set
      section_title: section.section_title || "Untitled",
      questions_type: section.questions_type || "unknown",
      evaluations: section.evaluations,
    }));

    examResult.total_score = totalScore;
    examResult.max_score = maxScore;

    // Mark fields as modified for Mongoose
    examResult.markModified("sections");

    await examResult.save();
    console.log("Exam corrected and saved:", examResult);

    return examResult;
  } catch (error) {
    console.error("Error in correctExam:", error.message || error);
    throw error;
  }
};

exports.getStudentExamResult = async (req, res) => {
  try {
    const { examId, studentId } = req.params;
    const teacherId = req.user.id;

    // Step 1: Fetch the exam
    const exam = await Exam.findById(examId).populate("course");
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    // Step 2: Verify ownership
    if (exam.course.teacher.toString() !== teacherId) {
      return res.status(403).json({
        message: "Access denied: You do not own this course.",
      });
    }

    // Step 3: Fetch student's exam result
    const examResult = await ExamResult.findOne({
      exam: examId,
      student: studentId,
    })
      .populate("student", "firstName lastName username")
      .lean();

    if (!examResult) {
      return res
        .status(404)
        .json({ message: "Result for this student not found." });
    }

    // Step 4: Construct the response with sections
    res.status(200).json({
      success: true,
      courseName: exam.course.name,
      examType: exam.exam_type,
      student: examResult.student,
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
      message: "An error occurred while fetching the student's exam result.",
    });
  }
};

exports.getExamResults = async (req, res) => {
  try {
    const { examId } = req.params;
    const teacherId = req.user.id;

    // Step 1: Fetch the exam
    const exam = await Exam.findById(examId).populate("course");
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    // Step 2: Verify ownership
    if (exam.course.teacher.toString() !== teacherId) {
      return res.status(403).json({
        message: "Access denied: You do not own this course.",
      });
    }

    // Step 3: Fetch all results for the exam
    const examResults = await ExamResult.find({ exam: examId })
      .populate("student", "firstName lastName username")
      .lean();

    if (!examResults || examResults.length === 0) {
      return res
        .status(404)
        .json({ message: "No results found for this exam." });
    }

    // Step 4: Include sections in the response
    const formattedResults = examResults.map((result) => ({
      student: result.student,
      total_score: result.total_score,
      max_score: result.max_score,
      sections: result.sections, // Include the sections with evaluations
    }));

    res.status(200).json({
      success: true,
      courseName: exam.course.name,
      examType: exam.exam_type,
      results: formattedResults,
    });
  } catch (error) {
    console.error("Error fetching exam results:", error.message || error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the exam results.",
    });
  }
};

exports.getTeacherExamResults = async (req, res) => {
  try {
    const teacherId = req.user.id; // Get the authenticated teacher's ID
    const currentTime = new Date();

    // Step 1: Fetch all exams associated with the teacher
    const exams = await Exam.find({})
      .populate({
        path: "course",
        match: { teacher: teacherId },
        select: "name _id",
      })
      .select("exam_topic exam_type scheduledDateTime endTime course");

    // Filter exams where course exists and endTime has passed
    const teacherExams = exams.filter(
      (exam) => exam.course && exam.scheduledDateTime <= currentTime
    );

    if (teacherExams.length === 0) {
      return res
        .status(404)
        .json({ message: "No completed exams found for your courses." });
    }

    // Step 2: Sort exams by scheduledDateTime (ascending order)
    teacherExams.sort(
      (a, b) => new Date(a.scheduledDateTime) - new Date(b.scheduledDateTime)
    );

    // Step 3: Fetch results for all completed exams
    const examResults = await ExamResult.find({
      exam: { $in: teacherExams.map((exam) => exam._id) },
    })
      .populate("student", "firstName lastName username")
      .lean();

    if (examResults.length === 0) {
      return res
        .status(404)
        .json({ message: "No results found for completed exams." });
    }

    // Step 4: Format results to include only completed exams
    const formattedResults = teacherExams.map((exam) => {
      const resultsForExam = examResults.filter(
        (result) => result.exam.toString() === exam._id.toString()
      );

      return {
        exam_id: exam._id,
        exam_topic: exam.exam_topic,
        exam_type: exam.exam_type,
        exam_date: exam.scheduledDateTime,
        course_id: exam.course._id,
        course_name: exam.course.name,
        results: resultsForExam
          .filter((result) => result.student) // Ensure student exists
          .map((result) => ({
            student: {
              firstName: result.student?.firstName || "Unknown",
              lastName: result.student?.lastName || "Unknown",
              username: result.student?.username || "Unknown",
            },
            total_score: result.total_score,
            max_score: result.max_score,
            sections: result.sections, // Include the sections with evaluations
          })),
      };
    });

    res.status(200).json({
      success: true,
      exams: formattedResults,
    });
  } catch (error) {
    console.error(
      "Error fetching teacher exam results:",
      error.message || error
    );
    res.status(500).json({
      message: "An error occurred while fetching exam results.",
      error: error.message,
    });
  }
};

exports.editQuestion = async (req, res) => {
  const { examId, sectionId, questionId } = req.params;
  const {
    question,
    model_answer,
    grading_criteria,
    choices,
    correct_answer,
    full_mark,
  } = req.body; // Updated question details
  const teacherId = req.user.id; // Assuming req.user contains the authenticated teacher info

  try {
    // Step 1: Fetch the exam and populate the course
    const exam = await Exam.findOne({ _id: examId }).populate({
      path: "course",
      select: "teacher",
    });

    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    // Step 2: Verify course ownership
    if (!exam.course || exam.course.teacher.toString() !== teacherId) {
      return res
        .status(403)
        .json({ message: "Access denied: You do not own this course." });
    }

    // Step 3: Find the section in the exam
    const section = exam.sections.id(sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ message: "Section not found in this exam." });
    }

    // Step 4: Find the question in the section
    const questionToEdit = section.questions.id(questionId);
    if (!questionToEdit) {
      return res
        .status(404)
        .json({ message: "Question not found in this section." });
    }

    // Step 5: Update the question fields
    if (question) questionToEdit.question = question;
    if (model_answer) questionToEdit.model_answer = model_answer;
    if (grading_criteria) questionToEdit.grading_criteria = grading_criteria;
    if (choices) questionToEdit.choices = choices;
    if (correct_answer) questionToEdit.correct_answer = correct_answer;
    if (full_mark !== undefined) questionToEdit.full_mark = full_mark; // Include full_mark update

    // Step 6: Save the exam
    await exam.save();

    res.status(200).json({
      message: "Question updated successfully.",
      question: questionToEdit,
    });
  } catch (error) {
    console.error("Error editing question:", error.message || error);
    res.status(500).json({
      message: "An error occurred while editing the question.",
      error: error.message,
    });
  }
};

exports.deleteExam = async (req, res) => {
  const { courseId, examId } = req.params;
  const teacherId = req.user.id; // Assume req.user contains the authenticated teacher's ID

  try {
    // Verify that the course belongs to the authenticated teacher
    const course = await Course.findOne({ _id: courseId, teacher: teacherId });
    if (!course) {
      return res
        .status(403)
        .json({ message: "Access denied: You do not own this course." });
    }

    // Verify that the exam exists and belongs to the specified course
    const exam = await Exam.findOne({ _id: examId, course: courseId });
    if (!exam) {
      return res
        .status(404)
        .json({ message: "Exam not found or does not belong to this course." });
    }

    // Remove the exam from the course's exams array
    await Course.findByIdAndUpdate(courseId, {
      $pull: { exams: examId },
    });

    // Delete the exam document from the database
    await Exam.findByIdAndDelete(examId);

    res.status(200).json({ message: "Exam deleted successfully." });
  } catch (error) {
    console.error("Error deleting exam:", error.message || error);
    res.status(500).json({
      message: "Server error. Unable to delete exam.",
      error: error.message,
    });
  }
};

// Get Upcoming Exams
exports.getUpcomingExams = async (req, res) => {
  const teacherId = req.user.id; // Authenticated teacher's ID

  try {
    const now = moment().utc().toDate(); // Current UTC time

    // Fetch exams that haven't ended and belong to the teacher's courses
    const exams = await Exam.find({
      isScheduled: true,
      endTime: { $gte: now },
    })
      .populate({
        path: "course",
        match: { teacher: teacherId }, // Ensure course is owned by the teacher
        select: "name _id",
      })
      .sort({ scheduledDateTime: 1 });

    // Filter out exams for courses not owned by the teacher (in case of unmatched `populate`)
    const validExams = exams.filter((exam) => exam.course);

    if (!validExams.length) {
      return res.status(404).json({
        message: "No upcoming or ongoing exams found for your courses.",
      });
    }

    // Format the response
    const formattedExams = validExams.map((exam) => ({
      _id: exam._id,
      courseId: exam.course._id,
      course: exam.course.name,
      examType: exam.exam_type,
      date: moment(exam.scheduledDateTime)
        .tz("Africa/Cairo")
        .format("YYYY-MM-DD"),
      time: moment(exam.scheduledDateTime).tz("Africa/Cairo").format("HH:mm"),
      duration:
        exam.duration >= 1440
          ? `${Math.floor(exam.duration / 1440)}d ${Math.floor(
              (exam.duration % 1440) / 60
            )}h ${exam.duration % 60}m`
          : `${Math.floor(exam.duration / 60)}h ${exam.duration % 60}m`,
    }));

    res.status(200).json({ exams: formattedExams });
  } catch (error) {
    console.error("Error fetching upcoming exams:", error.message || error);
    res.status(500).json({
      message: "Failed to fetch exams. Please try again later.",
      error: error.message,
    });
  }
};

exports.scheduleExam = async (req, res) => {
  const { examType, time, date, hours, minutes, examId } = req.body;
  const teacherId = req.user.id; // Assuming req.user contains the authenticated teacher's ID
  console.log(req.body);

  try {
    // Validate request body
    if (!examType || !time || !date || !hours || !minutes || !examId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Parse the input time and date
    const [hour, minute] = time.split(":").map(Number);
    const scheduledCairoTime = moment
      .tz(date, "YYYY-MM-DD", "Africa/Cairo")
      .hour(hour)
      .minute(minute)
      .second(0);

    // Convert to UTC
    const scheduledDateTime = scheduledCairoTime.utc().toDate();

    // Calculate the total duration in minutes
    const totalDuration = parseInt(hours) * 60 + parseInt(minutes);
    if (totalDuration <= 0) {
      return res
        .status(400)
        .json({ message: "Duration must be greater than 0." });
    }

    // Find the exam and verify it belongs to a course owned by the teacher
    const exam = await Exam.findById(examId).populate("course");
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    // Check if the course belongs to the authenticated teacher
    if (exam.course.teacher.toString() !== teacherId) {
      return res.status(403).json({
        message: "Access denied: You do not own this course.",
      });
    }

    // Update exam details
    exam.exam_type = examType;
    exam.scheduledDateTime = scheduledDateTime; // Store as UTC
    exam.endTime = moment(scheduledDateTime)
      .add(totalDuration, "minutes")
      .toDate();
    exam.duration = totalDuration;
    exam.isScheduled = true;

    await exam.save();

    res.status(200).json({ message: "Exam scheduled successfully.", exam });
  } catch (error) {
    console.error("Error scheduling exam:", error.message || error);
    res
      .status(500)
      .json({ message: "An error occurred.", error: error.message });
  }
};

exports.addQuestion = async (req, res) => {
  const { courseId, examId, sectionId } = req.params;
  const {
    question,
    model_answer,
    grading_criteria,
    choices,
    correct_answer,
    full_mark,
  } = req.body;
  const teacherId = req.user.id; // Assuming req.user contains authenticated teacher info

  try {
    // Verify course ownership
    const course = await Course.findOne({ _id: courseId, teacher: teacherId });
    if (!course) {
      return res
        .status(403)
        .json({ message: "Access denied: You do not own this course." });
    }

    // Fetch the exam and section
    const exam = await Exam.findOne({ _id: examId, course: courseId });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    const section = exam.sections.id(sectionId);
    if (!section) {
      return res.status(404).json({ message: "Section not found." });
    }

    // Calculate the next question number
    const questionNumber = section.questions.length + 1;

    // Create the new question
    const newQuestion = {
      question_number: questionNumber,
      question,
      model_answer,
      grading_criteria,
      choices,
      correct_answer,
      full_mark,
    };

    // Add the question to the section
    section.questions.push(newQuestion);

    // Save the exam
    await exam.save();

    res.status(201).json({
      message: "Question added successfully.",
      question: newQuestion,
    });
  } catch (error) {
    console.error("Error adding question:", error.message || error);
    res.status(500).json({
      message: "An error occurred while adding the question.",
      error: error.message,
    });
  }
};

exports.deleteQuestion = async (req, res) => {
  const { examId, sectionId, questionId } = req.params;
  const teacherId = req.user.id; // Assuming req.user contains the authenticated teacher info

  try {
    // Find the exam and populate the course for teacher validation
    const exam = await Exam.findOne({ _id: examId }).populate({
      path: "course",
      select: "teacher",
    });

    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    // Verify course ownership
    if (!exam.course || exam.course.teacher.toString() !== teacherId) {
      return res
        .status(403)
        .json({ message: "Access denied: You do not own this course." });
    }

    // Find the section in the exam
    const section = exam.sections.id(sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ message: "Section not found in this exam." });
    }

    // Find the question index in the section
    const questionIndex = section.questions.findIndex(
      (q) => q._id.toString() === questionId
    );
    if (questionIndex === -1) {
      return res
        .status(404)
        .json({ message: "Question not found in this section." });
    }

    // Remove the question from the section
    section.questions.splice(questionIndex, 1);

    // Save the updated exam document
    await exam.save();

    res.status(200).json({
      message: "Question deleted successfully.",
      section, // Return the updated section for reference
    });
  } catch (error) {
    console.error("Error deleting question:", error.message || error);
    res.status(500).json({
      message: "An error occurred while deleting the question.",
      error: error.message,
    });
  }
};

exports.updateStudentScore = async (req, res) => {
  try {
    const { examId, studentId } = req.params;
    const { sections } = req.body;
    const teacherId = req.user.id; // Get teacher ID from authenticated user

    // Validate input data
    if (
      !mongoose.Types.ObjectId.isValid(examId) ||
      !mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(teacherId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid examId, studentId, or teacherId provided." });
    }

    if (!Array.isArray(sections) || sections.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid sections data provided." });
    }

    // Fetch the exam and populate the course with the teacher
    const exam = await Exam.findById(examId).populate("course");

    if (!exam || !exam.course) {
      return res
        .status(404)
        .json({ message: "Exam or associated course not found." });
    }

    // Authorization check: Ensure the teacher is the assigned one
    if (!exam.course.teacher || exam.course.teacher.toString() !== teacherId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update scores for this course." });
    }

    // Find the exam result for the student
    const examResult = await ExamResult.findOne({
      exam: examId,
      student: studentId,
    });

    if (!examResult) {
      return res.status(404).json({ message: "Exam result not found." });
    }

    let updatesApplied = false;

    // Iterate through provided sections to update scores
    sections.forEach((sectionUpdate) => {
      const section = examResult.sections.find(
        (sec) => sec.section_number === sectionUpdate.section_number
      );

      if (section) {
        sectionUpdate.evaluations.forEach((evaluationUpdate) => {
          const evaluation = section.evaluations.find(
            (eval) =>
              eval.question_id.toString() === evaluationUpdate.question_id
          );

          if (evaluation) {
            evaluation.total_score = evaluationUpdate.total_score;
            updatesApplied = true;
          }
        });
      }
    });

    if (!updatesApplied) {
      return res.status(400).json({
        message: "No valid updates were applied. Check question IDs.",
      });
    }

    // Recalculate total score
    examResult.total_score = examResult.sections.reduce(
      (sum, section) =>
        sum +
        section.evaluations.reduce(
          (sectionSum, eval) => sectionSum + eval.total_score,
          0
        ),
      0
    );

    // Save updated exam result
    await examResult.save();

    res.status(200).json({
      message: "Student scores updated successfully.",
      updatedExamResult: examResult,
    });
  } catch (error) {
    console.error("Error updating student score:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the score." });
  }
};
