const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const serveIndex = require("serve-index");

// Teacher routes
const courseRoutes = require("./routes/teacher/course");
const examRoutes = require("./routes/teacher/exam");
const chapterRoutes = require("./routes/teacher/chapter");
const teacherAuthRoutes = require("./routes/teacher/auth");

// Student routes
const studentAuthRoutes = require("./routes/student/auth");
const studentCourseRoutes = require("./routes/student/course");
const studentExamRoutes = require("./routes/student/exam");

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable CORS for all origins (or restrict to a specific origin)
app.use(
  cors({
    origin: "*", // Adjust if your frontend is on a different port or domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const directoryToServe = path.join(
  "/Users/jamalaldin/Documents/GitHub/EduGenie/client"
);

app.use(
  "/client",
  express.static(directoryToServe),
  serveIndex(directoryToServe, { icons: true })
);

// Middleware to log client IP addresses
// app.use((req, res, next) => {
//   // Get the client IP address
//   const clientIp = req.headers["x-forwarded-for"] || req.ip;

//   // Log the IP address
//   console.log(`Client IP: ${clientIp}`);

//   // Proceed to the next middleware or route handler
//   next();
// });

app.use((req, res, next) => {
  // Get the client IP address
  const clientIp = req.headers["x-forwarded-for"] || req.ip;

  // Get the requested endpoint (method and URL)
  const endpoint = `${req.method} ${req.originalUrl}`;

  // Log the IP address and the requested endpoint
  console.log(`Client IP: ${clientIp} - Requested Endpoint: ${endpoint}`);

  // Proceed to the next middleware or route handler
  next();
});

// Use the teacher routes
app.use("/teacher", courseRoutes);
app.use("/teacher", examRoutes);
app.use("/teacher", chapterRoutes);
app.use("/teacher", teacherAuthRoutes);

// Use the student routes
app.use("/student", studentAuthRoutes);
app.use("/student", studentCourseRoutes);
app.use("/student", studentExamRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() =>
    // Start the server
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server is running on http://localhost:${port}`);
    })
  )
  .catch((err) => console.error("Could not connect to MongoDB", err));
