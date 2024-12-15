"use client";
import { useState, useEffect } from "react";

interface ExamFormProps {
  onSubmit: (examData: any) => void;
  courseId: string; // Accept courseId as a prop
}

const MAX_SECTIONS = 3;

const ExamForm = ({ onSubmit, courseId }: ExamFormProps) => {
  const [sections, setSections] = useState(0);
  const [sectionDetails, setSectionDetails] = useState<any[]>([]);
  const [fileNames, setFileNames] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState("");

  useEffect(() => {
    const fetchFileNames = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/teacher/${courseId}/chapters`);
        if (!response.ok) throw new Error("Failed to fetch chapters");
        const data = await response.json();
        setFileNames(data || []);
      } catch (error) {
        console.error("Error fetching file names:", error);
      }
    };

    fetchFileNames();
  }, [courseId]);

  const handleSectionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let count = parseInt(e.target.value) || 0;

    if (count > MAX_SECTIONS) {
      count = MAX_SECTIONS;
    }
    setSections(count);

    setSectionDetails(
      Array(count)
        .fill(null)
        .map((_, i) => sectionDetails[i] || { type: "", number: "" })
    );
  };

  const handleSectionDetailChange = (index: number, field: string, value: string) => {
    const updatedDetails = [...sectionDetails];
    updatedDetails[index][field] = value;
    setSectionDetails(updatedDetails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!selectedFile) {
      return alert("Please select a chapter.");
    }
    if (sections === 0 || sectionDetails.some((s) => !s.type || !s.number)) {
      return alert("Please fill out all section details.");
    }

    const examData = {
      chapter: selectedFile,
      sections: sectionDetails,
      courseId: courseId, // Include courseId in the request
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/teacher/generate-exam`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(examData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate exam");
      }

      const result = await response.json();
      console.log("Exam generated successfully:", result);

      onSubmit(examData); // Notify the parent component
    } catch (error) {
      console.error("Error generating exam:", error);
      alert("Failed to generate the exam. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white shadow-md rounded-lg max-h-[80vh] overflow-y-auto"
    >
      <h2 className="text-xl font-bold mb-4 text-black">Create a New Exam</h2>

      {/* Choose Chapter */}
      <div className="mb-4">
        <label className="block text-gray-700">Choose Chapter</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
        >
          <option value="">Select a Chapter</option>
          {fileNames.map((file, i) => (
            <option key={i} value={file.name}>
              {file.name}
            </option>
          ))}
        </select>
      </div>

      {/* Input for number of sections */}
      <div className="mb-4">
        <label className="block text-gray-700">Number of Sections (Max {MAX_SECTIONS})</label>
        <input
          type="number"
          min="0"
          max={MAX_SECTIONS}
          value={sections}
          onChange={handleSectionsChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          placeholder={`Enter a number (max ${MAX_SECTIONS})`}
        />
      </div>

      {/* Section Details */}
      {sectionDetails.map((section, index) => (
        <div key={index} className="p-4 border rounded-md mb-4 bg-gray-50">
          <h3 className="font-semibold">Section {index + 1}</h3>
          <div className="mb-2">
            <label className="block text-gray-700">Question Type</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={section.type}
              onChange={(e) => handleSectionDetailChange(index, "type", e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="essay">Essay Questions</option>
              <option value="MCQ">Multiple Choice Questions</option>
              <option value="True/False">True/False</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Number of Questions</label>
            <input
              type="number"
              value={section.number}
              onChange={(e) => handleSectionDetailChange(index, "number", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter number of questions"
            />
          </div>
        </div>
      ))}

      {/* Submit Button */}
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
        Generate Exam
      </button>
    </form>
  );
};

export default ExamForm;