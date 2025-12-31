# EduGenie 🎓🤖  
**AI-Powered Educational Platform**

EduGenie is an AI-powered web platform designed to help teachers manage courses, create and schedule exams, and automatically evaluate student performance. The system leverages modern web technologies and AI to streamline assessment workflows and improve learning outcomes.

---

## 🚀 Features

### 👩‍🏫 Teacher Features
- Secure authentication and authorization (JWT-based)
- Course creation and management
- Student enrollment approval workflow
- Chapter and course material management
- Exam creation, scheduling, and editing
- Generating exams with different types of questions (MCQ, Essay, True/False) using AI
- Automated exam grading using AI
- View and manage student results and performance analytics

### 👨‍🎓 Student Features
- Secure registration and login
- Course enrollment requests
- Browse course chapters and materials
- Take online exams with timed sessions
- View detailed exam results and academic progress

### 🤖 AI Capabilities
- AI-assisted exam evaluation
- Automated grading and feedback generation using OpenAI API

---

## 🧠 Project Motivation

Teachers often face challenges in manually grading exams and tracking student performance, especially at scale. EduGenie was built to automate these processes, reduce manual effort, and provide a scalable and efficient assessment system enhanced by artificial intelligence.

---

## 🛠️ Tech Stack

**Frontend**
- Next.js
- Tailwind CSS
- Recharts
- MUI

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- RESTful APIs
- OpenAI API

---

## 🏗️ System Architecture

EduGenie follows a modular MERN architecture with clear separation of concerns:

- RESTful API backend
- Role-based access control (Teacher / Student)
- Secure authentication and authorization
- Scalable database design for courses, exams, and results
- AI integration layer for automated evaluation

---

## 🔐 Authentication & Security
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Protected API routes
- Secure password handling and input validation

---

## 📊 Scalability & Performance
- Designed to support large numbers of concurrent users
- Optimized database queries with pagination and filtering
- Modular backend architecture for maintainability and extensibility

---

## 👨‍💻 My Role

**Backend Engineer**

- Designed and implemented RESTful APIs
- Built authentication and authorization mechanisms
- Developed full exam lifecycle logic (creation, scheduling, submission, grading, exam generation, automatic answers corrections including subjective answers)
- Integrated OpenAI API for automated exam generation, grading, and feedback
- Designed MongoDB schemas for courses, exams, users, and results
- Collaborated within a 2-member team and presented the project before an academic committee

---

## 📦 Installation & Setup

> ⚠️ This project was developed as an academic graduation project and is not currently deployed.

### Prerequisites
- Node.js
- MongoDB
- npm or yarn

### Backend Setup
```bash
git clone https://github.com/GamalAldin/EduGenie.git
cd EduGenie
npm install
npm run dev
````

Create a `.env` file and configure:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

---

## 🧪 Future Improvements

* Dockerization and cloud deployment
* Real-time notifications

---

## 📚 Documentation

* Software Requirements & Specifications (SRS)
* Use-case and functional requirement definitions
* Class diagrams and system design documentation

---

## 📌 Project Status

✔ Completed and defended as a graduation project
✔ Successfully evaluated by an academic committee

---

## 📬 Contact

**Gamal Aldin Moshgi** <br>
Backend Developer (Node.js) <br>
LinkedIn: [https://www.linkedin.com/in/gamal-aldin-moshgi](https://www.linkedin.com/in/gamal-aldin-moshgi) <br>
GitHub: [https://github.com/GamalAldin](https://github.com/GamalAldin) <br>

**Tarek Ahmed** <br>
Frontend Developer (Next.js) <br>
GitHub: [https://github.com/tarek1836](https://github.com/tarek1836) <br>

---

⭐ If you find this project interesting, feel free to explore the code or reach out!


