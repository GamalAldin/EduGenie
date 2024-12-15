
// "use client";

// import { useState } from "react";
// import FormModal from "@/components/FormModal"; // Import FormModal
// import ExamForm from "@/components/forms/ExamForm"; // Import ExamForm

// const ExamsPage = ({ params }: { params: { courseId: string } }) => {
//   const { courseId } = params; // Access the courseId from params
//   const [isFormVisible, setFormVisible] = useState(false);

//   const handleGenerateExam = () => {
//     setFormVisible(true); // Show the form when the button is clicked
//   };

//   const handleCloseForm = () => {
//     setFormVisible(false); // Close the form when the modal is closed
//   };

//   const handleSubmitExam = (examData: any) => {
//     console.log("Exam Data Submitted:", examData);
//     // Here, you can send the exam data to your server or handle it as needed
//     setFormVisible(false); // Optionally close the form after submission
//   };

//   return (
//     <div className="p-6 bg-white shadow-md rounded-lg">
//       <h1 className="text-xl font-semibold mb-4">Exams for Course</h1>
//       <button
//         onClick={handleGenerateExam}
//         className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4"
//       >
//         Generate a New Exam
//       </button>

//       {/* Display FormModal with ExamForm inside when isFormVisible is true */}
//       {isFormVisible && (
//         <FormModal title="Create a New Exam" onClose={handleCloseForm}>
//           {/* Pass the courseId as a prop to ExamForm */}
//           <ExamForm onSubmit={handleSubmitExam} courseId={courseId} />
//         </FormModal>
//       )}
//     </div>
//   );
// };

// export default ExamsPage;

"use client";

import { useState, useEffect } from "react";
import FormModal from "@/components/FormModal"; // Import FormModal
import ExamForm from "@/components/forms/ExamForm"; // Import ExamForm
import { Exam, Section, Question } from "@/types/exam"; // Import Exam, Section, and Question types

const ExamsPage = ({ params }: { params: { courseId: string } }) => {
  const { courseId } = params; // Access the courseId from params
  const [exams, setExams] = useState<Exam[] | null>(null); // Change to store array of exams
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setFormVisible] = useState(false);

  // Fetch exams on component mount
  useEffect(() => {
    if (!courseId) return;

    const fetchExams = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/teacher/${courseId}/exams`);
        if (!response.ok) {
          throw new Error('Failed to fetch exam data');
        }
        const data: Exam[] = await response.json();
        console.log('Fetched exams data:', data); // Debugging
        setExams(data); // Update the state to hold an array of exams
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [courseId]);

  // Handle the "Generate a New Exam" button click
  const handleGenerateExam = () => {
    setFormVisible(true); // Show the form when the button is clicked
  };

  // Handle the form modal close
  const handleCloseForm = () => {
    setFormVisible(false); // Close the form when the modal is closed
  };

  // Handle exam submission
  const handleSubmitExam = (examData: any) => {
    console.log("Exam Data Submitted:", examData);
    // You can send the exam data to your server or handle it as needed
    setFormVisible(false); // Optionally close the form after submission
    setExams(prevExams => [...(prevExams || []), examData]); // Add the new exam to the list
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-semibold mb-4">Exams for Course</h1>
      <button
        onClick={handleGenerateExam}
        className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4"
      >
        Generate a New Exam
      </button>

      {/* Display FormModal with ExamForm inside when isFormVisible is true */}
      {isFormVisible && (
        <FormModal title="Create a New Exam" onClose={handleCloseForm}>
          {/* Pass the courseId as a prop to ExamForm */}
          <ExamForm onSubmit={handleSubmitExam} courseId={courseId} />
        </FormModal>
      )}

      {/* Render exams list */}
      {exams && exams.length > 0 ? (
        exams.map((exam) => (
          <div key={exam._id}>
            <h1>Exam Topic: {exam.exam_topic || 'No topic available'}</h1>
            <h2>Course ID: {exam.course || 'No course ID available'}</h2>
            {exam.sections && exam.sections.length > 0 ? (
              exam.sections.map((section) => (
                <SectionComponent key={section._id} section={section} />
              ))
            ) : (
              <p>No sections available.</p>
            )}
          </div>
        ))
      ) : (
        <p>No exams available.</p>
      )}
    </div>
  );
};

// Section component to display each section in the exam
const SectionComponent = ({ section }: { section: Section }) => {
  return (
    <div>
      <h3>
        Section {section.section_number}: {section.section_title}
      </h3>
      {section.questions && section.questions.length > 0 ? (
        section.questions.map((question) => (
          <QuestionComponent key={question._id} question={question} />
        ))
      ) : (
        <p>No questions available in this section.</p>
      )}
    </div>
  );
};

// Question component to display each question
const QuestionComponent = ({ question }: { question: Question }) => {
  return (
    <div>
      <p><strong>Question {question.question_number}:</strong> {question.question || 'No question text available'}</p>

      {/* Check if question.choices is defined and not empty */}
      {question.choices && question.choices.length > 0 && (
        <ul>
          {question.choices.map((choice, index) => (
            <li key={index}>{choice}</li>
          ))}
        </ul>
      )}

      <p><strong>Model Answer:</strong> {question.model_answer || 'No model answer available'}</p>

      <p><strong>Grading Criteria:</strong></p>
      <ul>
        {question.grading_criteria.length > 0 ? (
          question.grading_criteria.map((criteria, index) => (
            <li key={index}>{criteria}</li> // Directly display the string in the criteria array
          ))
        ) : (
          <li>No grading criteria available</li>
        )}
      </ul>
    </div>
  );
};

export default ExamsPage;


