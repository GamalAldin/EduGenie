const express = require("express");
const multer = require("multer");
const path = require("path");

const chapterController = require("../../controller/teacher/chapter");

const dest = path.join(__dirname, "..", "..", "uploads");

// Ensure the uploads directory exists
const fs = require("fs");
if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

const upload = multer({
  dest: dest,
  fileFilter: (req, file, cb) => {
    console.log("Processing file:", file.originalname); // Debug log
    if (file.mimetype !== "application/pdf") {
      console.error("Invalid file type:", file.mimetype);
      return cb(new Error("Only PDF files are allowed!"), false);
    }
    cb(null, true);
  },
});

const router = express.Router();

// Route to handle file upload
router.post(
  "/:courseId/upload",
  (req, res, next) => {
    upload.single("pdfFile")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error("Multer Error:", err);
        return res.status(400).send(`Multer Error: ${err.message}`);
      } else if (err) {
        console.error("File Upload Error:", err);
        return res.status(400).send(`Error: ${err.message}`);
      }
      next();
    });
  },
  chapterController.uploadChapter
);

// Get all chapters
router.get("/:courseId/chapters", chapterController.getChapters);

router.get("/chapters", chapterController.listChapters);

// View chapter as a pdf
router.get("/:courseId/:chapterId/pdf", chapterController.viewChapterPdf);

// Delete chapter
router.delete("/:courseId/:chapterId", chapterController.deleteChapter);

module.exports = router;
