const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Mailtrap configuration for Nodemailer
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.mail_username, // Replace with Mailtrap username
    pass: process.env.mail_pass, // Replace with Mailtrap password
  },
});

const sendVerificationEmail = async (user, userId) => {
  try {
    // Generate a JWT token for email verification
    const verificationToken = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET, // Use a secure secret in production
      { expiresIn: "1h" } // Token valid for 1 hour
    );

    // Construct the verification link
    const verificationLink = `${process.env.APP_URL}/api/auth/verify-email?token=${verificationToken}`;

    // Email options
    const mailOptions = {
      from: '"EduGenie" <noreply@edugenie.com>',
      to: user.email,
      subject: "Verify Your Email",
      html: `
        <h1>Welcome to EduGenie, ${user.username}!</h1>
        <p>We're excited to have you on board. Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}" target="_blank" style="color: #4CAF50; text-decoration: none;">Verify My Email</a>
        <p>If you didn't sign up for EduGenie, you can safely ignore this email.</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${user.email}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Could not send verification email.");
  }
};

module.exports = { sendVerificationEmail };

// const { MailtrapClient } = require("mailtrap");
// const jwt = require("jsonwebtoken");

// const TOKEN = "3cf294b5a9d463c5acb12ca0c868dbfe"; // Your Mailtrap API token
// const ENDPOINT = "https://send.api.mailtrap.io/";

// const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

// /**
//  * Send a verification email to the user.
//  * @param {Object} user - The user object containing email and username.
//  * @param {String} user.email - The user's email address.
//  * @param {String} user.username - The user's username.
//  * @param {String} userId - The user's ID.
//  */
// const sendVerificationEmail = async (user, userId) => {
//   try {
//     // Generate a JWT token for email verification
//     const verificationToken = jwt.sign(
//       { id: userId },
//       process.env.JWT_SECRET, // Use a secure secret in production
//       { expiresIn: "1h" } // Token valid for 1 hour
//     );

//     // Construct the verification link
//     const verificationLink = `${process.env.APP_URL}/api/auth/verify-email?token=${verificationToken}`;

//     // Mailtrap sender and recipient details
//     const sender = {
//       email: "mailtrap@demomailtrap.com",
//       name: "EduGenie Support",
//     };

//     const recipients = [
//       {
//         email: user.email,
//       },
//     ];

//     // Email content
//     const email = {
//       from: sender,
//       to: recipients,
//       subject: "Verify Your Email",
//       html: `
//         <h1>Welcome to EduGenie, ${user.username}!</h1>
//         <p>We're excited to have you on board. Please verify your email address by clicking the link below:</p>
//         <a href="${verificationLink}" target="_blank" style="color: #4CAF50; text-decoration: none;">Verify My Email</a>
//         <p>If you didn't sign up for EduGenie, you can safely ignore this email.</p>
//       `,
//     };

//     // Send the email
//     await client.send(email);
//     console.log(`Verification email sent to ${user.email}`);
//   } catch (error) {
//     console.error("Error sending verification email:", error.message || error);
//     throw new Error("Could not send verification email.");
//   }
// };

// module.exports = { sendVerificationEmail };
