"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Exam } from "@/types/exam";

const ExamDetailsPage = () => {
  const { courseId, examId } = useParams(); // Dynamic route parameters
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId || !examId) {
      setError("Missing courseId or examId");
      setLoading(false);
      return;
    }

    const fetchExamDetails = async () => {
      if (!process.env.NEXT_PUBLIC_API) {
        setError("API base URL is not defined");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/teacher/${courseId}/exams/${examId}`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch exam details: ${response.statusText}`
          );
        }
        const data: Exam = await response.json();
        setExam(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [courseId, examId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!exam) return <p>No exam data available.</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-semibold mb-4">Exam Details</h1>
      <p>
        <strong>Exam ID:</strong> {exam._id}
      </p>
      <p>
        <strong>Exam Topic:</strong> {exam.exam_topic || "No topic available"}
      </p>
      <p>
        <strong>Course ID:</strong> {exam.course || "No course ID available"}
      </p>

      {exam.sections?.length > 0 ? (
        exam.sections.map((section) => (
          <div key={section._id} className="mb-4">
            <h2 className="text-lg font-medium">
              Section {section.section_number}: {section.section_title}
            </h2>
            {section.questions?.length > 0 ? (
              section.questions.map((question) => (
                <div key={question._id} className="mb-2">
                  <p>
                    <strong>Question {question.question_number}:</strong>{" "}
                    {question.question}
                  </p>

                  {question.choices?.length ? (
                    <ul>
                      {question.choices.map((choice, index) => (
                        <li key={index}>{choice}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">
                      No choices available.
                    </p>
                  )}

                  <p>
                    <strong>Model Answer:</strong> {question.model_answer}
                  </p>
                  <p>
                    <strong>Grading Criteria:</strong>
                  </p>
                  <ul>
                    {question.grading_criteria?.length ? (
                      question.grading_criteria.map((criteria, index) => (
                        <li key={index}>{criteria}</li>
                      ))
                    ) : (
                      <li className="text-gray-500 italic">
                        No grading criteria available.
                      </li>
                    )}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">
                No questions available in this section.
              </p>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">No sections available.</p>
      )}
    </div>
  );
};

export default ExamDetailsPage;
