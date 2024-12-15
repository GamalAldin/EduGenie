// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import FormModal from "@/components/FormModal"; // Import FormModal
// import ExamForm from "@/components/forms/ExamForm"; // Import ExamForm
// import { Exam } from "@/types/exam"; // Import Exam type

// const ExamsPage = ({ params }: { params: { courseId: string } }) => {
//   const { courseId } = params;
//   const [exams, setExams] = useState<Exam[] | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isFormVisible, setFormVisible] = useState(false);

//   useEffect(() => {
//     if (!courseId) return;

//     const fetchExams = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API}/teacher/${courseId}/exams`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch exam data");
//         }
//         const data: Exam[] = await response.json();
//         setExams(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Unknown error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExams();
//   }, [courseId]);

//   const handleGenerateExam = () => {
//     setFormVisible(true); // Open the form modal
//   };

//   const handleCloseForm = () => {
//     setFormVisible(false); // Close the form modal
//   };

//   const handleSubmitExam = (examData: Exam) => {
//     console.log("Exam Data Submitted:", examData);
//     setFormVisible(false); // Optionally close the form after submission
//     setExams((prevExams) => [...(prevExams || []), examData]); // Add the new exam to the list
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div className="p-6 bg-white shadow-md rounded-lg">
//       <h1 className="text-xl font-semibold mb-4">Exams for Course</h1>
//       <button
//         onClick={handleGenerateExam}
//         className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
//       >
//         Generate a New Exam
//       </button>

//       {/* Form Modal for Exam Creation */}
//       {isFormVisible && (
//         <FormModal title="Create a New Exam" onClose={handleCloseForm}>
//           <ExamForm onSubmit={handleSubmitExam} courseId={courseId} />
//         </FormModal>
//       )}

//       {exams && exams.length > 0 ? (
//         <table className="min-w-full bg-white border">
//           <thead>
//             <tr>
//               <th className="py-2 px-4 border">Exam Name</th>
//               <th className="py-2 px-4 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {exams.map((exam, index) => (
//               <tr key={exam._id} className="border">
//                 <td className="py-2 px-4 border">Exam {index + 1}</td>
//                 <td className="py-2 px-4 border">
//                   <Link
//                     href={`${courseId}/exams/${exam._id}`}
//                     className="text-blue-500 hover:underline"
//                   >
//                     View Details
//                   </Link>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No exams available.</p>
//       )}
//     </div>
//   );
// };

// export default ExamsPage;

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import FormModal from "@/components/FormModal"; // Import FormModal
import ExamForm from "@/components/forms/ExamForm"; // Import ExamForm
import { Exam } from "@/types/exam"; // Import Exam type

const ExamsPage = ({ params }: { params: { courseId: string } }) => {
  const { courseId } = params;
  const [exams, setExams] = useState<Exam[]>([]); // Default to an empty array
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setFormVisible] = useState(false);

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
    setExams((prevExams) => [...prevExams, examData]); // Add the new exam to the list
    setFormVisible(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-semibold mb-4">
        Exams for Course {courseId}
      </h1>
      <button
        onClick={handleGenerateExam}
        className={`mb-4 px-4 py-2 bg-blue-500 text-white rounded ${
          isFormVisible ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isFormVisible}
      >
        Generate a New Exam
      </button>

      {/* Form Modal for Exam Creation */}
      {isFormVisible && (
        <FormModal title="Create a New Exam" onClose={handleCloseForm}>
          <ExamForm onSubmit={handleSubmitExam} courseId={courseId} />
        </FormModal>
      )}

      {exams.length > 0 ? (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Exam Name</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam._id} className="border">
                <td className="py-2 px-4 border">
                  {exam.exam_topic || "Exam"}
                </td>
                <td className="py-2 px-4 border">
                  <Link
                    href={`/${courseId}/exams/${exam._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View Details
                  </Link>
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
