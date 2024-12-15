const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");

const courseRoutes = require("./routes/teacher/course");
const examRoutes = require("./routes/teacher/exam");
const chapterRoutes = require("./routes/teacher/chapter");

const app = express();
const port = 5000;

app.use(express.json());
app.use(bodyParser.json());

// Enable CORS for all origins (or restrict to a specific origin)
app.use(
  cors({
    origin: "*", // Adjust if your frontend is on a different port or domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to log client IP addresses
app.use((req, res, next) => {
  // Get the client IP address
  const clientIp = req.headers["x-forwarded-for"] || req.ip;

  // Log the IP address
  console.log(`Client IP: ${clientIp}`);

  // Proceed to the next middleware or route handler
  next();
});

// Use the exam routes and upload routes
app.use("/teacher", courseRoutes);
app.use("/teacher", examRoutes);
app.use("/teacher", chapterRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() =>
    // Start the server
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server is running on http://localhost:${port}`);
    })
  )
  .catch((err) => console.error("Could not connect to MongoDB", err));
