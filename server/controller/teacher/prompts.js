exports.generateExamPrompt = (ch, sec = []) => {
  const chapter = ch;
  const sections = sec;

  // Basic prompt structure for exam generation
  let prompt = `You are an AI examiner. Based on the provided content, generate an exam that includes the following sections:\n\n`;
  prompt += `**Exam Topic:** ${chapter}\n\n`;

  // Handle sections, defaulting to empty array if not provided
  sections.forEach((section, index) => {
    prompt += `**Section ${index + 1}:**\n`;
    prompt += `Number of Questions: ${section.number}\n\n`;
    prompt += `For each question in this section, include the following:\n`;
    prompt += `- question_number: Unique identifier within the section\n`;
    prompt += `- question: The text of the question\n`;
    prompt += `- model_answer: A detailed answer to the question\n`;
    prompt += `- grading_criteria: generate detailed grading criteria for the question based on its model answer. The grading criteria should be specific and broken down into the following levels:\n\n`;

    prompt += `
    1. **Full Marks**: Provide a detailed explanation of what a student must include in their answer to receive full marks. Specify the points allocated for each part of the answer and the total score for a fully correct answer.
    2. **Partial Marks**: Describe the elements of a partially correct answer. Indicate the points a student should receive for an incomplete or partially correct answer, and list what parts of the model answer are necessary for partial credit.
    3. **Zero Marks**: Explain the characteristics of an incorrect or incomplete answer that would result in zero marks. Provide a description of common mistakes or omissions that lead to a failure to meet the grading criteria.
    `;

    if (section.type === "MCQ") {
      prompt += `- choices: An array of four answer options\n`;
      prompt += `- correct_answer: The correct choice from the options provided\n`;
    } else if (section.type === "True/False") {
      prompt += `- correct_answer: Either "true" or "false"\n`;
    }

    prompt += `\n`;
  });

  // Final exam structure
  prompt += `**Output the exam in JSON format following this structure:**\n\n`;
  prompt += `{
    "exam_topic": "Topic derived from the input",
    "sections": [
      {
        "section_number": 1,
        "section_title": "Questions Type",
        "questions": [
          {
            "question_number": 1,
            "question": "Generated question",
            "model_answer": "Expected detailed answer",
            "grading_criteria": [
              "Full marks: X points for complete response",
              "Partial credit: Y points for partially correct response",
              "0 points for incorrect or missing answers"
            ]
          }
        ]
      }
    ]
  }`;

  return prompt;
};

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

exports.correctExamPrompt = (
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
