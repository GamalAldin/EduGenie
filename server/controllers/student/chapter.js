const fs = require("fs");
const path = require("path");

const Chapter = require("../../models/teacher/chapter");
const Course = require("../../models/teacher/course");

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
