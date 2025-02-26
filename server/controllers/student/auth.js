const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../../models/student/student"); // Adjust the path as needed
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      "/Users/jamalaldin/Documents/GitHub/EduGenie/cheating-detection/Users"
    ); // Save uploaded files to the 'uploads' folder
  },
  filename: function (req, file, cb) {
    // Use the username from the request body as the filename
    const username = req.body.username;
    if (!username) {
      return cb(new Error("Username is required."));
    }
    const filename = username + path.extname(file.originalname); // e.g., "john_doe.jpg"
    cb(null, filename);
  },
});

const upload = multer({ storage: storage }).single("profilePicture"); // 'profilePicture' is the field name for the file

exports.signup = async (req, res) => {
  // Handle file upload
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "File upload error." });
    } else if (err) {
      return res
        .status(500)
        .json({ message: err.message || "Internal server error." });
    }

    const { username, email, password, firstName, lastName } = req.body;

    try {
      // Validate required fields
      if (!username || !email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "All fields are required." });
      }

      // Check if email or username already exists
      const existingEmail = await Student.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email is already taken." });
      }

      const existingUsername = await Student.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "Username is already taken." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      if (!req.file) {
        return res
          .status(400)
          .json({ message: "You must upload a personal photo." });
      }

      // Get the uploaded file path (if any)
      const profilePicture = req.file ? req.file.path : null;

      // Create a new student
      const student = new Student({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        profilePicture, // Save the file path to the database
      });

      // Save the student to the database
      await student.save();

      res.status(201).json({
        message: "Student signed up successfully!",
      });
    } catch (error) {
      console.error("Error during sign-up:", error.message || error);
      res.status(500).json({ message: "Internal server error." });
    }
  });
};

// Sign-Up Function
// exports.signup = async (req, res) => {
//   const { username, email, password, firstName, lastName } = req.body;

//   try {
//     // Validate required fields
//     if (!username || !email || !password || !firstName || !lastName) {
//       return res.status(400).json({ message: "All fields are required." });
//     }

//     // Check if email or username already exists
//     const existingEmail = await Student.findOne({ email });
//     if (existingEmail) {
//       return res.status(400).json({ message: "Email is already taken." });
//     }

//     const existingUsername = await Student.findOne({ username });
//     if (existingUsername) {
//       return res.status(400).json({ message: "Username is already taken." });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new student
//     const student = new Student({
//       username,
//       email,
//       password: hashedPassword,
//       firstName,
//       lastName,
//     });

//     // Save the student to the database
//     await student.save();

//     res.status(201).json({
//       message: "Student signed up successfully!",
//     });
//   } catch (error) {
//     console.error("Error during sign-up:", error.message || error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// };

// Sign-In Function
exports.signin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the username exists
    const student = await Student.findOne({ username });
    if (!student) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: student._id,
        username: student.username,
        firstName: student.firstName,
        lastName: student.lastName,
        role: "student",
      }, // Added role field
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.status(200).json({
      message: "Sign-in successful!",
      token,
      student: {
        id: student._id,
        username: student.username,
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName,
      },
    });
  } catch (error) {
    console.error("Error during sign-in:", error.message || error);
    res.status(500).json({ message: "Internal server error." });
  }
};
