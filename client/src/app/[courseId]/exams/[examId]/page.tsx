"use client";
<<<<<<< Updated upstream
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Exam } from "@/types/exam";

const ExamDetailsPage = () => {
  const { courseId, examId } = useParams(); // Dynamic route parameters
=======

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Exam } from "@/types/exam";

const ExamDetailsPage = () => {
  const { courseId, examId } = useParams();
>>>>>>> Stashed changes
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
<<<<<<< Updated upstream
    if (!courseId || !examId) {
      setError("Missing courseId or examId");
      setLoading(false);
      return;
    }
=======
    if (!courseId || !examId) return;
>>>>>>> Stashed changes

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
        console.error("Error fetching exam details:", err);
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
<<<<<<< Updated upstream

      {exam.sections?.length > 0 ? (
=======
      {exam.sections && exam.sections.length > 0 ? (
>>>>>>> Stashed changes
        exam.sections.map((section) => (
          <div key={section._id}>
            <h2>
              Section {section.section_number}: {section.section_title}
            </h2>
<<<<<<< Updated upstream
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
=======
            {section.questions.map((question) => (
              <p key={question._id}>{question.question}</p>
            ))}
>>>>>>> Stashed changes
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">No sections available.</p>
      )}
    </div>
  );
};

export default ExamDetailsPage;
