const Teacher = require("../../models/teacher/teacher");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../../utils/emailVerification");
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
// Sign-Up Function
exports.signup = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "File upload error." });
    } else if (err) {
      return res
        .status(500)
        .json({ message: err.message || "Internal server error." });
    }

    const {
      username,
      email,
      password,
      firstName,
      lastName,
      birthdate,
      gender,
    } = req.body;

    console.log("REQUEST BODY: ", req.body);
    console.log("UPLOADED FILE: ", req.file); // Check if file is uploaded or not

    try {
      if (
        !username ||
        !email ||
        !password ||
        !firstName ||
        !lastName ||
        !birthdate ||
        !gender
      ) {
        return res
          .status(400)
          .json({ message: "All fields except profile picture are required." });
      }

      const birthdateObj = new Date(birthdate);
      if (isNaN(birthdateObj.getTime())) {
        return res.status(400).json({ message: "Invalid birthdate format." });
      }

      const existingEmail = await Teacher.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email is already taken." });
      }

      const existingUsername = await Teacher.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "Username is already taken." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Set profilePicture to null if no file is uploaded
      const profilePicturePath = req.file ? req.file.path : null;

      // Create a new teacher object
      const teacher = new Teacher({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        birthdate: birthdateObj,
        gender,
        profilePicture: profilePicturePath, // Save file path or null
        isVerified: false,
      });

      await teacher.save();

      try {
        await sendVerificationEmail(
          { email: teacher.email, username: teacher.username },
          teacher._id
        );
      } catch (emailError) {
        console.error("Error sending verification email:", emailError.message);
      }

      res.status(201).json({
        message: "Teacher signed up successfully! Please verify your email.",
      });
    } catch (error) {
      console.error("Error during sign-up:", error.message);
      res.status(500).json({ message: "Internal server error." });
    }
  });
};

// Verify Email Function
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const teacher = await Teacher.findByIdAndUpdate(
      userId,
      { isVerified: true },
      { new: true }
    );

    if (!teacher) {
      return res
        .status(404)
        .json({ message: "User not found or already verified." });
    }

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Error verifying email:", error.message);
    res.status(400).json({ message: "Invalid or expired token." });
  }
};

// Sign-In Function
exports.signin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const teacher = await Teacher.findOne({ username });
    if (!teacher) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    // if (!teacher.isVerified) {
    //   return res
    //     .status(403)
    //     .json({ message: "Please verify your email to sign in." });
    // }

    const isPasswordValid = await bcrypt.compare(password, teacher.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    const token = jwt.sign(
      {
        id: teacher._id,
        username: teacher.username,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        role: "teacher",
      },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.status(200).json({
      message: "Sign-in successful!",
      token,
      teacher: {
        id: teacher._id,
        username: teacher.username,
        email: teacher.email,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
      },
    });
  } catch (error) {
    console.error("Error during sign-in:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};
