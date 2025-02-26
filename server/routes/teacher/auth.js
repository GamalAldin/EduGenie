const express = require("express");
const router = express.Router();
const authController = require("../../controllers/teacher/auth");

// Sign-Up Route
router.post("/signup", authController.signup);

// Verify Email Route
router.get("/verify-email", authController.verifyEmail);

// Sign-In Route
router.post("/signin", authController.signin);

module.exports = router;
