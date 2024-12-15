"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import FormModal from "@/components/FormModal";
import TableSearch from "@/components/TableSearch";
import QuestionForm from "@/components/forms/QuestionForm"; // A form to add/edit a question
import { Exam, Question, Section } from "@/types/exam";

const ExamDetailsPage = () => {
  const { courseId, examId } = useParams();
  const [exam, setExam] = useState<Exam | null>(null);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFormModal, setShowFormModal] = useState(false); // Add/Edit Question Modal
  const [selectedSection, setSelectedSection] = useState<Section | null>(null); // Track selected section
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  ); // Track selected question
  const router = useRouter();

  useEffect(() => {
    fetchExamDetails();
  }, [courseId, examId]);

  const fetchExamDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/teacher/${courseId}/exams/${examId}`
      );
      if (!response.ok) throw new Error("Failed to fetch exam details");
      const data: Exam = await response.json();
      setExam(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!exam) return;

    const allQuestions = exam.sections.flatMap((section) => section.questions);
    const filtered = allQuestions.filter((question) =>
      question.question.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredQuestions(filtered);
  };

  const handleDeleteQuestion = async (
    sectionId: string,
    questionId: string
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/teacher/${courseId}/exams/${examId}/sections/${sectionId}/questions/${questionId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete question");
      fetchExamDetails(); // Refresh the exam details after deletion
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question.");
    }
  };

  const handleEditQuestion = (section: Section, question: Question) => {
    setSelectedSection(section);
    setSelectedQuestion(question);
    setShowFormModal(true); // Open the modal
  };

  const handleAddQuestion = (section: Section) => {
    setSelectedSection(section);
    setSelectedQuestion(null); // No question selected means adding a new one
    setShowFormModal(true);
  };

  const handleSubmitQuestion = async (questionData: Question) => {
    try {
      const method = selectedQuestion ? "PUT" : "POST";
      const url = selectedQuestion
        ? `${process.env.NEXT_PUBLIC_API}/teacher/${courseId}/exams/${examId}/sections/${selectedSection?._id}/questions/${selectedQuestion._id}`
        : `${process.env.NEXT_PUBLIC_API}/teacher/${courseId}/exams/${examId}/sections/${selectedSection?._id}/questions`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) throw new Error("Failed to save question");
      alert("Question saved successfully.");
      setShowFormModal(false); // Close the modal
      fetchExamDetails(); // Refresh the exam details
    } catch (error) {
      console.error("Error saving question:", error);
      alert("Failed to save question.");
    }
  };

  const columns = [
    { header: "No.", accessor: "number", className: "w-10 text-center" }, // Added for question number
    { header: "Question", accessor: "question" },
    { header: "Actions", accessor: "actions", className: "w-40 text-center" },
  ];

  const renderRow = (question: Question, section: Section, index: number) => (
    <tr key={question._id} className="hover:bg-gray-100">
      <td className="px-4 py-2 text-center">{index + 1}</td>{" "}
      {/* Question number */}
      <td className="px-4 py-2">{question.question}</td>
      <td className="px-4 py-2 text-center">
        <div className="flex justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditQuestion(section, question);
            }}
            className="text-blue-500 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteQuestion(section._id, question._id);
            }}
            className="text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-6 rounded-md">
      <h1 className="text-lg font-semibold">Exam Details</h1>
      <div className="flex justify-between items-center mb-4">
        <TableSearch
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {exam?.sections?.map((section) => (
        <div key={section._id} className="mb-6">
          <h2 className="text-lg font-semibold">
            Section {section.section_number}: {section.section_title}
          </h2>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => handleAddQuestion(section)}
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              + Add Question
            </button>
          </div>
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-center w-10">No.</th>
                <th className="px-4 py-2 text-left">Question</th>
                <th className="px-4 py-2 text-center w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {section.questions.map((question, index) =>
                renderRow(question, section, index)
              )}
            </tbody>
          </table>
        </div>
      ))}

      {showFormModal && (
        <FormModal
          title={selectedQuestion ? "Edit Question" : "Add Question"}
          onClose={() => setShowFormModal(false)}
        >
          <QuestionForm
            question={selectedQuestion}
            onSubmit={handleSubmitQuestion}
          />
        </FormModal>
      )}
    </div>
  );
};

export default ExamDetailsPage;
