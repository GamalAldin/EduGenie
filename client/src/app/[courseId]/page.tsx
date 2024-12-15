"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormModal from "@/components/FormModal";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import ChapterForm from "@/components/forms/ChapterForm";
import { Chapter } from "@/types/chapter";

const CourseDetailsPage = ({ params }: { params: { courseId: string } }) => {
  const { courseId } = params;
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [filteredChapters, setFilteredChapters] = useState<Chapter[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFormModal, setShowFormModal] = useState(false); // Control modal visibility

  const router = useRouter();

  useEffect(() => {
    fetchChapters();
  }, [courseId]);

  const fetchChapters = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/teacher/${courseId}/chapters`);
      if (!response.ok) throw new Error("Failed to fetch chapters");
      const data = await response.json();
      setChapters(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      setFilteredChapters(
        chapters.filter((chapter) =>
          chapter.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredChapters(chapters);
    }
  }, [searchQuery, chapters]);

  const handleAddChapter = (formData: FormData) => {
    fetch(`${process.env.NEXT_PUBLIC_API}/teacher/${courseId}/upload`, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to upload chapter");
        return res.json();
      })
      .then(() => {
        alert("Chapter added successfully.");
        setShowFormModal(false); // Close the modal
        fetchChapters(); // Re-fetch chapters to ensure updated data is displayed
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to upload chapter.");
      });
  };

  const columns = [
    { header: "Chapter Title", accessor: "title" },
    { header: "Actions", accessor: "actions" },
  ];

  const renderRow = (chapter: Chapter) => (
    <tr
      key={chapter._id}
      className="hover:bg-gray-100 cursor-pointer"
      onClick={() => handleChapterClick(chapter._id)} // Trigger PDF fetch on row click
    >
      <td>{chapter.name || "Untitled Chapter"}</td>
      <td>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              fetch(`${process.env.NEXT_PUBLIC_API}/teacher/${courseId}/${chapter._id}`, {
                method: "DELETE",
              }).then(() => setChapters((prev) => prev.filter((ch) => ch._id !== chapter._id)));
            }}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );

  // New function to handle chapter click and fetch the PDF
  const handleChapterClick = async (chapterId: string) => {
    try {
      // Send GET request to fetch the PDF
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/teacher/${courseId}/${chapterId}/pdf`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch PDF");
      }

      // Convert response to Blob (PDF)
      const pdfBlob = await response.blob();

      // Create a URL for the PDF Blob
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Open the PDF in a new tab or download it
      window.open(pdfUrl, "_blank"); // To open in a new tab
      // Alternatively, you can trigger a download like this:
      // const link = document.createElement("a");
      // link.href = pdfUrl;
      // link.download = "chapter.pdf"; // You can specify a name for the download
      // link.click(); // Trigger the download
    } catch (error) {
      console.error("Error fetching PDF:", error);
      alert("Failed to load PDF.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-md">
      <h1 className="text-lg font-semibold">Course Details</h1>
      <div className="flex justify-between items-center mb-4">
        <TableSearch value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <button
          onClick={() => setShowFormModal(true)}
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          + Add New Chapter
        </button>
      </div>

      <Table columns={columns} data={filteredChapters} renderRow={renderRow} />

      {showFormModal && (
        <FormModal title="Add New Chapter" onClose={() => setShowFormModal(false)}>
          <ChapterForm onSubmit={handleAddChapter} />
        </FormModal>
      )}
    </div>
  );
};

export default CourseDetailsPage;
