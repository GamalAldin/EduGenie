// exports.generateExamPrompt = (ch, sec = []) => {
//   const chapter = ch;
//   const sections = sec;

//   // Basic prompt structure for exam generation
//   let prompt = `You are an AI examiner. Based on the provided content, generate an exam that includes the following sections:\n\n`;
//   prompt += `**Exam Topic:** ${chapter}\n\n`;

//   // Handle sections, defaulting to empty array if not provided
//   sections.forEach((section, index) => {
//     prompt += `**Section ${index + 1}:**\n`;
//     prompt += `Number of Questions: ${section.number}\n\n`;
//     prompt += `For each question in this section, include the following:\n`;
//     prompt += `- question_number: Unique identifier within the section\n`;
//     prompt += `- question: The text of the question\n`;
//     prompt += `- model_answer: A detailed answer to the question\n`;
//     prompt += `- grading_criteria: Generate detailed grading criteria for the question based on its model answer. The grading criteria should be specific and broken down into the following levels:\n\n`;

//     prompt += `
//     1. **Full Marks**: Provide a detailed explanation of what a student must include in their answer to receive full marks. Specify the points allocated for each part of the answer and the total score for a fully correct answer.
//     2. **Partial Marks**: Describe the elements of a partially correct answer. Indicate the points a student should receive for an incomplete or partially correct answer, and list what parts of the model answer are necessary for partial credit.
//     3. **Zero Marks**: Explain the characteristics of an incorrect or incomplete answer that would result in zero marks. Provide a description of common mistakes or omissions that lead to a failure to meet the grading criteria.
//     `;

//     if (section.type === "MCQ") {
//       prompt += `- choices: An array of exactly four answer options. Each option must be labeled as A), B), C), or D) to maintain a consistent format.\n`;
//       prompt += `- correct_answer: Specify the correct choice as one of the labeled options (e.g., "A", "B", "C", or "D").\n`;
//     } else if (section.type === "True/False") {
//       prompt += `- correct_answer: Either "true" or "false"\n`;
//     }

//     prompt += `\n`;
//   });

//   // Final exam structure
//   prompt += `**Output the exam in JSON format following this structure:**\n\n`;
//   prompt += `{
//     "exam_topic": "Topic derived from the input",
//     "sections": [
//       {
//         "section_number": 1,
//         "section_title": "Section Title",
//         "questions_type": "essay || mcq || true/false",
//         "questions": [
//           {
//             "question_number": 1,
//             "question": "Generated question",
//             "choices": [
//               "A) Option 1",
//               "B) Option 2",
//               "C) Option 3",
//               "D) Option 4"
//             ],
//             "correct_answer": "C",
//             "model_answer": "Expected detailed answer",
//             "full_mark": "X",
//             "grading_criteria": [
//               "Full marks: X points for complete response",
//               "Partial credit: Y points for partially correct response",
//               "0 points for incorrect or missing answers"
//             ]
//           }
//         ]
//       }
//     ]
//   }`;

//   return prompt;
// };

// exports.correctExamPrompt = (question, model_answer, student_answer, grading_criteria) => {
//   const criteria = grading_criteria.join(' ');
//   const prompt = `
// You are an intelligent grading assistant. Your task is to evaluate a student's answer by comparing it to the provided model answer and grading it based on the given grading criteria. Each criterion is assigned specific points, and you will allocate points based on the completeness and accuracy of the student's response.

// Here is the data you will use for evaluation:

// - **Question:** ${question}
// - **Model Answer:** ${model_answer}
// - **Student Answer:** ${student_answer}
// - **Grading Criteria:** ${criteria}

// Evaluate the student's answer as follows:
// 1. For each criterion, determine if the student's response fully meets, partially meets, or does not meet the criterion.
// 2. Allocate points accordingly.
// 3. Provide a detailed explanation for the score, including feedback on how the student could improve their answer.

// Return the result in the following JSON format:
// {
//   "question": "{question_text}",
//   "student_answer": "{student_answer}",
//   "evaluation": {
//     "total_score": {total_score},
//     "max_score": {max_score},
//     "breakdown": [
//       {
//         "criterion": "{criteria_1}",
//         "points_awarded": {awarded_points_1},
//         "feedback": "{feedback_for_criteria_1}"
//       },
//       {
//         "criterion": "{criteria_2}",
//         "points_awarded": {awarded_points_2},
//         "feedback": "{feedback_for_criteria_2}"
//       },
//       ...
//     ]
//   }
// }
// `;
//   return prompt;
// };
// generate exam 2
// exports.generateExamPrompt = (ch, sec = []) => {
//   const chapter = ch;
//   const sections = sec;

//   // Basic prompt structure for exam generation
//   let prompt = `You are an AI examiner. Based on the provided content, generate an exam that includes the following sections:\n\n`;
//   prompt += `**Exam Topic:** ${chapter}\n\n`;

//   // Handle sections, defaulting to empty array if not provided
//   sections.forEach((section, index) => {
//     prompt += `**Section ${index + 1}:**\n`;
//     prompt += `Number of Questions: ${section.number}\n\n`;
//     prompt += `For each question in this section, include the following:\n`;
//     prompt += `- question_number: Unique identifier within the section\n`;
//     prompt += `- question: The text of the question\n`;
//     prompt += `- model_answer: A detailed answer to the question\n`;
//     prompt += `- full_mark: A valid numeric value greater than 0 for the maximum points a student can earn for this question. It must be an integer.\n`;
//     prompt += `- grading_criteria: Generate detailed grading criteria for the question based on its model answer. The grading criteria should be specific and broken down into the following levels:\n\n`;

//     prompt += `
//     1. **Full Marks**: Provide a detailed explanation of what a student must include in their answer to receive full marks. Specify the points allocated for each part of the answer and the total score for a fully correct answer.
//     2. **Partial Marks**: Describe the elements of a partially correct answer. Indicate the points a student should receive for an incomplete or partially correct answer, and list what parts of the model answer are necessary for partial credit.
//     3. **Zero Marks**: Explain the characteristics of an incorrect or incomplete answer that would result in zero marks. Provide a description of common mistakes or omissions that lead to a failure to meet the grading criteria.
//     `;

//     if (section.type === "MCQ") {
//       prompt += `- choices: An array of exactly four answer options. Each option must be labeled as A), B), C), or D). Ensure that the options are diverse and plausible, and only one is correct.\n`;
//       prompt += `- correct_answer: Specify the correct choice as one of the labeled options (e.g., "A", "B", "C", or "D").\n`;
//     } else if (section.type === "True/False") {
//       prompt += `- correct_answer: Either "true" or "false".\n`;
//     }

//     prompt += `\n`;
//   });

//   // Final exam structure
//   prompt += `**Output the exam in JSON format following this structure:**\n\n`;
//   prompt += `{
//     "exam_topic": "Topic derived from the input",
//     "sections": [
//       {
//         "section_number": 1,
//         "section_title": "Section Title",
//         "questions_type": "essay || mcq || true/false",
//         "questions": [
//           {
//             "question_number": 1,
//             "question": "Generated question",
//             "choices": [
//               "A) Option 1",
//               "B) Option 2",
//               "C) Option 3",
//               "D) Option 4"
//             ], // Include choices for MCQ questions only
//             "correct_answer": "C", // Correct option or true/false
//             "model_answer": "Expected detailed answer",
//             "full_mark": 10, // A numeric value greater than 0
//             "grading_criteria": [
//               "Full marks: 10 points for complete response",
//               "Partial credit: 5 points for partially correct response",
//               "0 points for incorrect or missing answers"
//             ]
//           }
//         ]
//       }
//     ]
//   }`;

//   return prompt;
// };
// Generate exam 3

// exports.generateExamPrompt = (chapters, sec = []) => {
//   // Ensure chapters is an array, and join them into a single topic string
//   const chapterList = Array.isArray(chapters) ? chapters.join(", ") : chapters;
//   const sections = sec;

//   // Basic prompt structure for exam generation
//   let prompt = `You are an AI examiner. Based on the provided content from the following chapters, generate an exam that includes the following sections:\n\n`;
//   prompt += `**Exam Topics:** ${chapterList}\n\n`;

//   // Handle sections, defaulting to empty array if not provided
//   sections.forEach((section, index) => {
//     prompt += `**Section ${index + 1}:**\n`;
//     prompt += `- Section Title: ${section.title}\n`;
//     prompt += `- Number of Questions: ${section.number}\n\n`;
//     prompt += `For each question in this section, include the following:\n`;
//     prompt += `- question_number: Unique identifier within the section\n`;
//     prompt += `- question: The text of the question\n`;
//     prompt += `- model_answer: A detailed answer to the question\n`;
//     prompt += `- full_mark: A valid numeric value greater than 0 for the maximum points a student can earn for this question. It must be an integer.\n`;
//     prompt += `- grading_criteria: Generate detailed grading criteria for the question based on its model answer. The grading criteria should be specific and broken down into the following levels:\n\n`;

//     prompt += `
//     1. **Full Marks**: Provide a detailed explanation of what a student must include in their answer to receive full marks. Specify the points allocated for each part of the answer and the total score for a fully correct answer.
//     2. **Partial Marks**: Describe the elements of a partially correct answer. Indicate the points a student should receive for an incomplete or partially correct answer, and list what parts of the model answer are necessary for partial credit.
//     3. **Zero Marks**: Explain the characteristics of an incorrect or incomplete answer that would result in zero marks. Provide a description of common mistakes or omissions that lead to a failure to meet the grading criteria.
//     `;

//     if (section.type === "MCQ") {
//       prompt += `- choices: An array of exactly four answer options. Each option must be labeled as A), B), C), or D). Ensure that the options are diverse and plausible, and only one is correct.\n`;
//       prompt += `- correct_answer: Specify the correct choice as one of the labeled options (e.g., "A", "B", "C", or "D").\n`;
//     } else if (section.type === "True/False") {
//       prompt += `- correct_answer: Either "true" or "false".\n`;
//     }

//     prompt += `\n`;
//   });

//   // Final exam structure
//   prompt += `**Output the exam in JSON format following this structure:**\n\n`;
//   prompt += `{
//     "exam_topic": "Topic derived from the input chapters",
//     "sections": [
//       {
//         "section_number": 1,
//         "section_title": "Section Title",
//         "questions_type": "essay || mcq || true/false",
//         "questions": [
//           {
//             "question_number": 1,
//             "question": "Generated question",
//             "choices": [
//               "A) Option 1",
//               "B) Option 2",
//               "C) Option 3",
//               "D) Option 4"
//             ], // Include choices for MCQ questions only
//             "correct_answer": "C", // Correct option or true/false
//             "model_answer": "Expected detailed answer",
//             "full_mark": 10, // A numeric value greater than 0
//             "grading_criteria": [
//               "Full marks: 10 points for complete response",
//               "Partial credit: 5 points for partially correct response",
//               "0 points for incorrect or missing answers"
//             ]
//           }
//         ]
//       }
//     ]
//   }`;

//   return prompt;
// };

// Final prompt
// exports.generateExamPrompt = (chapter, sections) => {
//   let prompt = `You are an AI examiner. Based on the provided content from the chapter "${chapter}", generate an exam that includes the following sections:\n\n`;

//   sections.forEach((section, index) => {
//     prompt += `**Section ${index + 1}:**\n`;
//     prompt += `- Section Title: ${section.title}\n`;
//     prompt += `- Number of Questions: Generate exactly ${section.number} questions for this section.\n\n`;
//     prompt += `For each question in this section, include the following:\n`;
//     prompt += `- question_number: Unique identifier within the section\n`;
//     prompt += `- question: The text of the question\n`;
//     prompt += `- model_answer: A detailed answer to the question\n`;
//     prompt += `- full_mark: A valid numeric value greater than 0 for the maximum points a student can earn for this question. It must be an integer.\n`;
//     prompt += `- grading_criteria: Generate detailed grading criteria for the question based on its model answer.\n`;

//     if (section.type === "MCQ") {
//       prompt += `- choices: An array of exactly four answer options. Each option must be labeled as A), B), C), or D). Ensure that the options are diverse and plausible, and only one is correct.\n`;
//       prompt += `- correct_answer: Specify the correct choice as one of the labeled options (e.g., "A", "B", "C", or "D").\n`;
//     } else if (section.type === "True/False") {
//       prompt += `- correct_answer: Either "true" or "false".\n`;
//     } else if (section.type === "essay") {
//       prompt += `- correct_answer: Use "N/A" for essay questions, as they do not have a single correct answer.\n`;
//     }

//     prompt += `\n`;
//   });

//   prompt += `**Output the exam in JSON format following this structure:**\n\n`;
//   prompt += `{
//     "exam_topic": "Topic derived from the input chapter",
//     "sections": [
//       {
//         "section_number": 1,
//         "section_title": "Section Title",
//         "questions_type": "essay || mcq || true/false",
//         "questions": [
//           {
//             "question_number": 1,
//             "question": "Generated question",
//             "choices": [
//               "A) Option 1",
//               "B) Option 2",
//               "C) Option 3",
//               "D) Option 4"
//             ], // Include choices for MCQ questions only
//             "correct_answer": "C", // Correct option or true/false
//             "model_answer": "Expected detailed answer",
//             "full_mark": 10, // A numeric value greater than 0
//             "grading_criteria": [
//               "Full marks: 10 points for complete response",
//               "Partial credit: 5 points for partially correct response",
//               "0 points for incorrect or missing answers"
//             ]
//           }
//         ]
//       }
//     ]
//   }`;

//   prompt += `\n\n**Important Instructions:**\n`;
//   prompt += `1. **Output Only JSON**: Your response must be a valid JSON object. Do not include any additional text, comments, or explanations outside the JSON structure.\n`;
//   prompt += `2. **Strict Formatting**: Ensure the JSON is properly formatted with correct syntax, including commas, brackets, and quotes.\n`;
//   prompt += `3. **No Comments**: Do not include comments (e.g., // or /* */) in the JSON output.\n`;
//   prompt += `4. **Validation**: Before responding, validate that the JSON is syntactically correct and adheres to the provided structure.\n`;
//   prompt += `5. **Required Fields**: Ensure that every question includes the following fields:\n`;
//   prompt += `   - question: The text of the question.\n`;
//   prompt += `   - model_answer: A detailed answer to the question.\n`;
//   prompt += `   - grading_criteria: Detailed grading criteria for the question.\n`;
//   prompt += `   - full_mark: A valid numeric value greater than 0.\n`;
//   prompt += `   - correct_answer: The correct answer (for MCQ and True/False questions).\n`;

//   return prompt;
// };

exports.generateExamPrompt = (chapter, sections) => {
  // Basic prompt structure for exam generation
  let prompt = `You are an AI examiner. Based on the provided content from the chapter "${chapter}", generate an exam that includes the following sections:\n\n`;

  // Calculate total marks for each section
  const totalMarks = 100;
  const marksPerSection = Math.floor(totalMarks / sections.length); // Distribute marks equally (or adjust as needed)

  // Handle sections
  sections.forEach((section, index) => {
    prompt += `**Section ${index + 1}:**\n`;
    prompt += `- Section Title: ${section.title}\n`;
    prompt += `- Number of Questions: Generate exactly ${section.number} questions for this section.\n`;
    prompt += `- Total Marks for Section: ${marksPerSection}\n\n`; // Assign marks to the section

    prompt += `For each question in this section, include the following:\n`;
    prompt += `- question_number: Unique identifier within the section\n`;
    prompt += `- question: The text of the question\n`;
    prompt += `- model_answer: A detailed answer to the question\n`;
    prompt += `- full_mark: A valid numeric value greater than 0 for the maximum points a student can earn for this question. It must be an integer.\n`;
    prompt += `- grading_criteria: Generate detailed grading criteria for the question based on its model answer.\n`;

    if (section.type === "MCQ") {
      prompt += `- choices: An array of exactly four answer options. Each option must be labeled as A), B), C), or D). Ensure that the options are diverse and plausible, and only one is correct.\n`;
      prompt += `- correct_answer: Specify the correct choice as one of the labeled options (e.g., "A", "B", "C", or "D").\n`;
    } else if (section.type === "True/False") {
      prompt += `- correct_answer: Either "true" or "false".\n`;
    } else if (section.type === "essay") {
      prompt += `- correct_answer: Use "N/A" for essay questions, as they do not have a single correct answer.\n`;
    }

    prompt += `\n`;
  });

  // Final exam structure
  prompt += `**Output the exam in JSON format following this structure:**\n\n`;
  prompt += `{
    "exam_topic": "Topic derived from the input chapter",
    "total_marks": 100, // Ensure the exam is out of 100 marks
    "sections": [
      {
        "section_number": 1,
        "section_title": "Section Title",
        "questions_type": "essay || mcq || true/false",
        "total_marks": ${marksPerSection}, // Marks for this section
        "questions": [
          {
            "question_number": 1,
            "question": "Generated question",
            "choices": [
              "A) Option 1",
              "B) Option 2",
              "C) Option 3",
              "D) Option 4"
            ], // Include choices for MCQ questions only
            "correct_answer": "C", // Correct option or true/false
            "model_answer": "Expected detailed answer",
            "full_mark": 10, // A numeric value greater than 0
            "grading_criteria": [
              "Full marks: 10 points for complete response",
              "Partial credit: 5 points for partially correct response",
              "0 points for incorrect or missing answers"
            ]
          }
        ]
      }
    ]
  }`;

  // Add strict instructions for JSON output
  prompt += `\n\n**Important Instructions:**\n`;
  prompt += `1. **Total Marks**: The exam must be out of 100 marks. Distribute the marks evenly or based on the importance of each section.\n`;
  prompt += `2. **Section Marks**: Each section should have a "total_marks" field, and the sum of all section marks must equal 100.\n`;
  prompt += `3. **Question Marks**: Each question should have a "full_mark" field, and the sum of all "full_mark" values in a section must equal the section's "total_marks".\n`;
  prompt += `4. **Output Only JSON**: Your response must be a valid JSON object. Do not include any additional text, comments, or explanations outside the JSON structure.\n`;
  prompt += `5. **Strict Formatting**: Ensure the JSON is properly formatted with correct syntax, including commas, brackets, and quotes.\n`;

  return prompt;
};

exports.correctExamPrompt1 = (
  question,
  model_answer,
  student_answer,
  grading_criteria
) => {
  // Validate grading_criteria
  if (!Array.isArray(grading_criteria)) {
    throw new Error("Grading criteria must be an array.");
  }

  const criteria = grading_criteria.join(" ");

  // Construct the prompt
  const prompt = `
You are an intelligent grading assistant. Your task is to evaluate a student's answer by comparing it to the provided model answer and grading it based on the given grading criteria. Each criterion is assigned specific points, and you will allocate points based on the completeness and accuracy of the student's response.

Here is the data you will use for evaluation:

- **Question:** ${question}
- **Model Answer:** ${model_answer}
- **Student Answer:** ${student_answer}
- **Grading Criteria:** ${criteria}

Evaluate the student's answer as follows:
1. For each criterion, determine if the student's response fully meets, partially meets, or does not meet the criterion.
2. Allocate points accordingly.
3. Provide a detailed explanation for the score, including feedback on how the student could improve their answer.

Return the result in the following JSON format:
{
  "question": "${question}",
  "student_answer": "${student_answer}",
  "evaluation": {
    "total_score": {total_score},
    "max_score": {max_score},
    "breakdown": [
      {
        "criterion": "{criteria_1}",
        "points_awarded": {awarded_points_1},
        "feedback": "{feedback_for_criteria_1}"
      },
      {
        "criterion": "{criteria_2}",
        "points_awarded": {awarded_points_2},
        "feedback": "{feedback_for_criteria_2}"
      }
    ]
  }
}
`;
  return prompt;
};

// exports.correctExamPrompt = (questionsWithAnswers) => {
//   // Validate questionsWithAnswers
//   if (
//     !Array.isArray(questionsWithAnswers) ||
//     questionsWithAnswers.length === 0
//   ) {
//     throw new Error("questionsWithAnswers must be a non-empty array.");
//   }

//   const questionsData = questionsWithAnswers
//     .map(({ question, model_answer, student_answer, grading_criteria }) => {
//       // Ensure grading_criteria is an array
//       if (!Array.isArray(grading_criteria)) {
//         throw new Error("Grading criteria must be an array.");
//       }

//       const criteria = grading_criteria.join(" ");

//       return `
// - **Question:** ${question}
// - **Model Answer:** ${model_answer}
// - **Student Answer:** ${student_answer}
// - **Grading Criteria:** ${criteria}
// `;
//     })
//     .join("\n");

//   // Construct the overall prompt
//   const prompt = `
// You are an intelligent grading assistant. Your task is to evaluate multiple student answers by comparing them to the provided model answers and grading each based on the respective grading criteria. Each criterion is assigned specific points, and you will allocate points based on the completeness and accuracy of the student's responses.

// Here is the data for evaluation:
// ${questionsData}

// Evaluate each question as follows:
// 1. For each criterion, determine if the student's response fully meets, partially meets, or does not meet the criterion.
// 2. Allocate points accordingly for each question.
// 3. Provide a detailed explanation for the score, including feedback on how the student could improve their answers.

// Return the results in JSON format only. Do not include any text or code block formatting like \`\`\`. Ensure the response starts and ends with { and }.
// {
//   "evaluations": [
//     {
//       "question": "{question_1}",
//       "student_answer": "{student_answer_1}",
//       "evaluation": {
//         "total_score": {total_score_1},
//         "max_score": {max_score_1},
//         "breakdown": [
//           {
//             "criterion": "{criteria_1}",
//             "points_awarded": {awarded_points_1},
//             "feedback": "{feedback_for_criteria_1}"
//           },
//           ...
//         ]
//       }
//     },
//     ...
//   ]
// }
// `;
//   return prompt;
// };

exports.correctExamPrompt = (questionsWithAnswers) => {
  // Validate questionsWithAnswers
  if (
    !Array.isArray(questionsWithAnswers) ||
    questionsWithAnswers.length === 0
  ) {
    throw new Error("questionsWithAnswers must be a non-empty array.");
  }

  const questionsData = questionsWithAnswers
    .map(({ question, model_answer, student_answer, grading_criteria }) => {
      // Ensure grading_criteria is an array
      if (!Array.isArray(grading_criteria)) {
        throw new Error("Grading criteria must be an array.");
      }

      const criteria = grading_criteria.join(" ");

      return `
- **Question:** ${question}
- **Model Answer:** ${model_answer}
- **Student Answer:** ${student_answer}
- **Grading Criteria:** ${criteria}
`;
    })
    .join("\n");

  // Construct the overall prompt
  const prompt = `
You are an intelligent grading assistant. Your task is to evaluate multiple student answers by comparing them to the provided model answers and grading each based on the respective grading criteria. Each criterion is assigned specific points, and you will allocate points based on the completeness and accuracy of the student's responses.

Here is the data for evaluation:
${questionsData}

Evaluate each question as follows:
1. For each criterion, determine if the student's response fully meets, partially meets, or does not meet the criterion.
2. Allocate points accordingly for each question.
3. Provide a detailed explanation for the score, including feedback on how the student could improve their answers.

Return the results in JSON format only. Do not include any text or code block formatting like \`\`\`. Ensure the response starts and ends with { and }.
{
  "evaluations": [
    {
      "question": "{question_1}",
      "student_answer": "{student_answer_1}",
      "evaluation": {
        "total_score": {total_score_1},
        "max_score": {max_score_1},
        "breakdown": [
          {
            "criterion": "{criteria_1}",
            "points_awarded": {awarded_points_1},
            "feedback": "{feedback_for_criteria_1}"
          },
          ...
        ]
      }
    },
    ...
  ]
}
`;
  return prompt;
};
