"use client";

import { useState, useEffect } from "react";
import FormModal from "@/components/FormModal";
import ExamForm from "@/components/forms/ExamForm";
import { Exam } from "@/types/exam";

const ExamsPage = ({ params }: { params: { courseId: string } }) => {
  const { courseId } = params;
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (!courseId) return;

    const fetchExams = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/teacher/${courseId}/exams`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch exam data");
        }
        const data: Exam[] = await response.json();
        setExams(data);
      } catch (err) {
        console.error("Error fetching exams:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [courseId]);

  const handleGenerateExam = () => setFormVisible(true);

  const handleCloseForm = () => setFormVisible(false);

  const handleSubmitExam = (examData: Exam) => {
    setExams((prevExams) => [...prevExams, examData]);
    setFormVisible(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteExam = async (examId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/teacher/${courseId}/exams/${examId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the exam");
      }

      setExams((prevExams) => prevExams.filter((exam) => exam._id !== examId));
    } catch (err) {
      console.error("Error deleting exam:", err);
      alert(err instanceof Error ? err.message : "Unknown error occurred");
    }
  };

  const handleCorrectExam = async (examId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/teacher/${courseId}/exams/${examId}/correct`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to correct the exam");
      }

      const correctionResult = await response.json();
      alert(`Exam corrected successfully: ${JSON.stringify(correctionResult)}`);
    } catch (err) {
      console.error("Error correcting exam:", err);
      alert(err instanceof Error ? err.message : "Unknown error occurred");
    }
  };

  const filteredExams = exams.filter(
    (exam) =>
      exam._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `exam${exams.indexOf(exam) + 1}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleGenerateExam}
          className={`bg-blue-600 text-white p-2 rounded-md ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading || isFormVisible}
        >
          + Generate a New Exam
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search Exams"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {isFormVisible && (
        <FormModal title="Create a New Exam" onClose={handleCloseForm}>
          <ExamForm onSubmit={handleSubmitExam} courseId={courseId} />
        </FormModal>
      )}

      {filteredExams.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left border-b text-gray-900">
                Exam Name
              </th>
              <th className="py-2 px-4 text-left border-b text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredExams.map((exam, index) => (
              <tr
                key={exam._id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  (window.location.href = `/${courseId}/exams/${exam._id}`)
                }
              >
                <td className="py-2 px-4 border-b text-gray-900">{`exam${
                  index + 1
                }`}</td>
                <td className="py-2 px-4 border-b text-gray-900">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteExam(exam._id);
                      }}
                      className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCorrectExam(exam._id);
                      }}
                      className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700"
                    >
                      Correct
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No exams available.</p>
      )}
    </div>
  );
};

export default ExamsPage;
