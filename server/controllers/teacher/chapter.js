const fs = require("fs");
const path = require("path");

const Chapter = require("../../models/teacher/chapter");
const Course = require("../../models/teacher/course");

const addChapterToCourse = async (courseId, fileName, filePath) => {
  try {
    // Create a new Chapter
    const newChapter = new Chapter({
      name: fileName,
      filePath: filePath, // Path to the uploaded PDF
      course: courseId,
    });

    const savedChapter = await newChapter.save();

    // Add the Chapter reference to the Course
    await Course.findByIdAndUpdate(courseId, {
      $push: { chapters: savedChapter._id },
    });

    console.log("Chapter added to course:", savedChapter);
  } catch (err) {
    console.error("Error adding chapter to course:", err);
  }
};

exports.uploadChapter = (req, res) => {
  const { courseId } = req.params;

  console.log("File received:", req.file);
  if (!req.file) {
    console.error("No file uploaded.");
    return res.status(400).send("No file uploaded.");
  }

  const uploadedFile = req.file;
  const fileName = uploadedFile.originalname;
  const filePath = path.join(__dirname, "..", "..", "uploads", fileName);

  // Ensure the uploads directory exists
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  // Rename the temporary file to the desired location
  fs.rename(uploadedFile.path, filePath, (err) => {
    if (err) {
      console.error("Error saving file:", err);
      return res.status(500).send("Error saving the file.");
    }
    console.log("File uploaded successfully to:", filePath);

    addChapterToCourse(courseId, fileName, filePath);

    res.send({
      message: "File uploaded successfully",
      fileName: fileName,
      filePath: filePath,
    });
  });
};

exports.listChapters = (req, res) => {
  const uploadDir = path.join(__dirname, "../../uploads");
  // Ensure the uploads directory exists
  if (!fs.existsSync(uploadDir)) {
    return res.status(200).json([]);
  }

  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error("Error reading upload directory:", err);
      return res.status(500).send("Error reading the upload directory.");
    }

    // Filter and return only PDF files without their extensions
    const fileNames = files
      .filter((file) => file.endsWith(".pdf"))
      .map((file) => path.basename(file, ".pdf"));

    res.json(fileNames);
  });
};

exports.getChapters = async (req, res) => {
  try {
    const { courseId } = req.params; // Extract courseId from the route parameters

    // Find all chapters associated with the courseId
    const chapters = await Chapter.find({ course: courseId });

    if (!chapters.length) {
      return res
        .status(404)
        .json({ message: "No chapters found for this course." });
    }

    // Send the chapters as the response
    res.status(200).json(chapters);
  } catch (error) {
    console.error("Error fetching chapters:", error);
    res
      .status(500)
      .json({ message: "Server error. Unable to fetch chapters." });
  }
};

exports.deleteChapter = async (req, res) => {
  const { courseId, chapterId } = req.params;
  console.log("params: ", req.params);
  console.log("course", courseId);
  console.log("chapter", chapterId);
  try {
    // Find the chapter to get its file path
    const chapter = await Chapter.findById(chapterId);

    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found." });
    }

    // Ensure the chapter belongs to the specified course
    if (chapter.course.toString() !== courseId) {
      return res
        .status(403)
        .json({ message: "Chapter does not belong to this course." });
    }

    // Remove the chapter from the course's chapters array
    await Course.findByIdAndUpdate(courseId, {
      $pull: { chapters: chapterId },
    });

    // Remove the chapter document from the database
    await Chapter.findByIdAndDelete(chapterId);

    // Delete the associated file from the server
    const filePath = chapter.filePath;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    }

    res.status(200).json({ message: "Chapter deleted successfully." });
  } catch (error) {
    console.error("Error deleting chapter:", error);
    res
      .status(500)
      .json({ message: "Server error. Unable to delete chapter." });
  }
};

exports.viewChapterPdf = async (req, res) => {
  const { chapterId } = req.params;

  try {
    // Find the chapter by ID
    const chapter = await Chapter.findById(chapterId);

    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found." });
    }

    const filePath = chapter.filePath;

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found." });
    }

    // Send the PDF file as a response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline"); // 'inline' to view in browser, 'attachment' to download
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error("Error serving PDF file:", error);
    res.status(500).json({ message: "Server error. Unable to serve file." });
  }
};
