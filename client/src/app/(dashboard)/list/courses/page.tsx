// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import FormModal from "@/components/FormModal";
// import Table from "@/components/Table";
// import TableSearch from "@/components/TableSearch";
// import CourseForm from "@/components/forms/CourseForm";
// import { Course } from "@/types/course";

// const CoursesPage = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [modalType, setModalType] = useState<"create" | "update" | null>(null);
//   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   const router = useRouter();

//   // Fetch courses on component mount
//   useEffect(() => {
//     const fetchCourses = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API}/teacher/courses`
//         );
//         if (!response.ok) throw new Error("Failed to fetch courses");
//         const data = await response.json();
//         if (data?.courses) {
//           setCourses(
//             data.courses.map((course: any) => ({
//               ...course,
//               id: course._id, // Map _id to id
//             }))
//           );
//         } else {
//           throw new Error("Invalid API response");
//         }
//       } catch (error) {
//         console.error(
//           error instanceof Error ? error.message : "An unknown error occurred"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCourses();
//   }, []);

//   // Update filteredCourses when courses or searchQuery changes
//   useEffect(() => {
//     if (searchQuery) {
//       setFilteredCourses(
//         courses.filter((course) =>
//           course.name.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//       );
//     } else {
//       setFilteredCourses(courses);
//     }
//   }, [searchQuery, courses]);

//   const handleCreateCourse = () => {
//     setModalType("create");
//     setSelectedCourse(null);
//   };

//  const handleEditCourse = (course: Course) => {
//   console.log("Editing course:", course); // Debug log to confirm id is present
//   setModalType("update");
//   setSelectedCourse(course)
//  };

//   const handleDeleteCourse = async (id: string) => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API}/teacher/course/${id}`,
//         {
//           method: "DELETE",
//         }
//       );
//       if (!response.ok) throw new Error("Failed to delete course");
//       setCourses((prev) => prev.filter((course) => course.id !== id));
//     } catch (error) {
//       console.error(
//         error instanceof Error ? error.message : "An unknown error occurred"
//       );
//     }
//   };

//   const handleSubmitCourse = async (data: Course) => {
//   const fetchCourses = async () => {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API}/teacher/courses`);
//     const data = await response.json();
//     setCourses(
//       data.courses.map((course: any) => ({
//         ...course,
//         id: course._id, // Map _id to id
//       }))
//     );
//   };

//   try {
//     if (modalType === "create") {
//       // Create a new course
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API}/teacher/course`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(data),
//         }
//       );
//       if (!response.ok) throw new Error("Failed to create course");

//       const { course } = await response.json();
//       console.log("Created course:", course); // Debug log

//       // Fetch the updated list of courses after creation
//       await fetchCourses();
//     } else if (modalType === "update" && selectedCourse) {
//       // Update an existing course
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API}/teacher/course/${selectedCourse.id}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(data),
//         }
//       );
//       if (!response.ok) throw new Error("Failed to update course");

//       const updatedCourse = await response.json();
//       console.log("Updated course:", updatedCourse);

//       // Update the courses state
//       setCourses((prev) =>
//         prev.map((course) =>
//           course.id === updatedCourse.course._id
//             ? { ...updatedCourse.course, id: updatedCourse.course._id }
//             : course
//         )
//       );
//     }

//     // Update filtered courses and close the modal
//     setFilteredCourses(
//       searchQuery
//         ? courses.filter((course) =>
//             course.name.toLowerCase().includes(searchQuery.toLowerCase())
//           )
//         : courses
//     );
//     setModalType(null);
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error("Error:", error.message); // Proper error handling
//     } else {
//       console.error("An unknown error occurred:", error); // Fallback for unknown errors
//     }
//   }
// };


//   const columns = [
//     { header: "Course Name", accessor: "name" },
//     { header: "Course Code", accessor: "courseCode" },
//     { header: "Actions", accessor: "actions" },
//   ];

//   const renderRow = (course: Course) => (
//     <tr
//       key={course.id}
//       className="hover:bg-gray-100 cursor-pointer"
//       onClick={() => router.push(`/${course.id}`)}
//     >
//       <td>{course.name}</td>
//       <td>{course.courseCode}</td>
//       <td>
//         <div className="flex gap-2">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               handleEditCourse(course);
//             }}
//             className="text-blue-500"
//           >
//             Edit
//           </button>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               handleDeleteCourse(course.id);
//             }}
//             className="text-red-500"
//           >
//             Delete
//           </button>
//         </div>
//       </td>
//     </tr>
//   );

//   return (
//     <div className="bg-white p-6 rounded-md">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-lg font-semibold">Courses</h1>
//         <div className="flex gap-4 items-center">
//           <TableSearch
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <button
//             onClick={handleCreateCourse}
//             className="bg-blue-500 text-white p-2 rounded-md"
//           >
//             + Add Course
//           </button>
//         </div>
//       </div>
//       {loading ? (
//         <div className="text-center">Loading...</div>
//       ) : (
//         <Table columns={columns} data={filteredCourses} renderRow={renderRow} />
//       )}
//       {modalType && (
//         <FormModal
//           title={modalType === "create" ? "Create Course" : "Update Course"}
//           onClose={() => setModalType(null)}
//         >
//           <CourseForm
//             type={modalType}
//             data={selectedCourse || { name: "", courseCode: "" }}
//             onSubmit={handleSubmitCourse}
//           />
//         </FormModal>
//       )}
//     </div>
//   );
// };

// export default CoursesPage; 
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormModal from "@/components/FormModal";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import CourseForm from "@/components/forms/CourseForm";
import { Course } from "@/types/course";

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalType, setModalType] = useState<"create" | "update" | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null); // To manage dropdown visibility

  const router = useRouter();

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/teacher/courses`
        );
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        if (data?.courses) {
          setCourses(
            data.courses.map((course: any) => ({
              ...course,
              id: course._id, // Map _id to id
            }))
          );
        } else {
          throw new Error("Invalid API response");
        }
      } catch (error) {
        console.error(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Update filteredCourses when courses or searchQuery changes
  useEffect(() => {
    if (searchQuery) {
      setFilteredCourses(
        courses.filter((course) =>
          course.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredCourses(courses);
    }
  }, [searchQuery, courses]);

  const handleCreateCourse = () => {
    setModalType("create");
    setSelectedCourse(null);
  };

  const handleEditCourse = (course: Course) => {
    setModalType("update");
    setSelectedCourse(course);
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/teacher/course/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete course");
      setCourses((prev) => prev.filter((course) => course.id !== id));
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const handleSubmitCourse = async (data: Course) => {
    const fetchCourses = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/teacher/courses`);
      const data = await response.json();
      setCourses(
        data.courses.map((course: any) => ({
          ...course,
          id: course._id, // Map _id to id
        }))
      );
    };

    try {
      if (modalType === "create") {
        // Create a new course
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/teacher/course`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );
        if (!response.ok) throw new Error("Failed to create course");

        const { course } = await response.json();
        // Fetch the updated list of courses after creation
        await fetchCourses();
      } else if (modalType === "update" && selectedCourse) {
        // Update an existing course
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/teacher/course/${selectedCourse.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );
        if (!response.ok) throw new Error("Failed to update course");

        const updatedCourse = await response.json();
        // Update the courses state
        setCourses((prev) =>
          prev.map((course) =>
            course.id === updatedCourse.course._id
              ? { ...updatedCourse.course, id: updatedCourse.course._id }
              : course
          )
        );
      }

      // Update filtered courses and close the modal
      setFilteredCourses(
        searchQuery
          ? courses.filter((course) =>
              course.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : courses
      );
      setModalType(null);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message); // Proper error handling
      } else {
        console.error("An unknown error occurred:", error); // Fallback for unknown errors
      }
    }
  };

  const toggleDropdown = (courseId: string) => {
    setDropdownOpen(dropdownOpen === courseId ? null : courseId);
  };

  const handleRedirect = (option: string, courseId: string) => {
    if (option === "chapters") {
      router.push(`/${courseId}`);
    } else if (option === "exams") {
      router.push(`/${courseId}/exams`);
    }
    setDropdownOpen(null); // Close the dropdown after selecting an option
  };

  const columns = [
    { header: "Course Name", accessor: "name" },
    { header: "Course Code", accessor: "courseCode" },
    { header: "Actions", accessor: "actions" },
  ];

  const renderRow = (course: Course) => (
    <tr
      key={course.id}
      className="hover:bg-gray-100 cursor-pointer"
      onClick={() => toggleDropdown(course.id)} // Open dropdown when clicking on course name
    >
      <td>{course.name}</td>
      <td>{course.courseCode}</td>
      <td>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditCourse(course);
            }}
            className="text-blue-500"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCourse(course.id);
            }}
            className="text-red-500"
          >
            Delete
          </button>
          {dropdownOpen === course.id && (
          <div className="absolute bg-white border border-gray-300 rounded-lg shadow-lg mt-2 w-48">
            <button
              onClick={() => handleRedirect("chapters", course.id)}
              className="block px-4 py-2 text-black hover:bg-blue-100 rounded-tl-lg rounded-tr-lg"
            >
              Chapters
            </button>
            <button
              onClick={() => handleRedirect("exams", course.id)}
              className="block px-4 py-2 text-black hover:bg-blue-100 rounded-bl-lg rounded-br-lg"
            >
              Exams
            </button>
          </div>
        )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-6 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Courses</h1>
        <div className="flex gap-4 items-center">
          <TableSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={handleCreateCourse}
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            + Add Course
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <Table columns={columns} data={filteredCourses} renderRow={renderRow} />
      )}
      {modalType && (
        <FormModal
          title={modalType === "create" ? "Create Course" : "Update Course"}
          onClose={() => setModalType(null)}
        >
          <CourseForm
            type={modalType}
            data={selectedCourse || { name: "", courseCode: "" }}
            onSubmit={handleSubmitCourse}
          />
        </FormModal>
      )}
    </div>
  );
};

export default CoursesPage;
