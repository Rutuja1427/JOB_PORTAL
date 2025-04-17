Job Portal & Admin Dashboard (MERN Stack)
🚀 Project Overview
A full-stack web application where:

Candidates can register, view, filter, and apply for job posts.

Admins can create, manage job postings, and view applications.

Built with MERN Stack — focusing on authentication, file upload, and admin management.

📚 Tech Stack
Frontend: React.js, Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB (Mongoose)

Authentication: JWT (JSON Web Token)

File Uploads: Multer

State Management: Redux Toolkit (optional)

🎯 Features
Candidate Side
Register/Login system with authentication.

View and filter job postings by category:

MERN, MEAN, PHP, Frontend, Backend, Python.

Apply for jobs:

Submit self-description.

Upload resume (PDF/DOC).

Admin Dashboard
Secure Admin login.

Create and manage job postings:

Title, Category, Description, Experience Required.

View all candidate applications:

Access resumes and descriptions.

🏗️ Project Structure
bash
Copy
Edit
/job-portal
  ├── /frontend
  │     ├── /src
  │     └── /public
  └── /backend
        ├── /controllers
        ├── /models
        ├── /routes
        ├── /middleware
        ├── /uploads
⚙️ Setup Instructions
1. Clone the Repository
bash
Copy
Edit
git clone <repository-link>
cd job-portal
2. Backend Setup
bash
Copy
Edit
cd backend
npm install
Create a .env file:

bash
Copy
Edit
MONGO_URI = your_mongodb_connection_url
JWT_SECRET = your_secret_key
Run server:

bash
Copy
Edit
npm run dev
3. Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm start
Frontend runs on: http://localhost:3000

Backend runs on: http://localhost:5000

📂 Important Dependencies
Frontend
react

react-router-dom

redux / redux-toolkit (optional)

axios

tailwindcss

Backend
express

mongoose

jsonwebtoken

bcryptjs

multer

dotenv

cors

❗ Challenges Faced
JWT-based secure authentication.

Handling file uploads with Multer.

Role-based access control for Admin/User.

Responsive UI with dynamic filtering.

💡 Future Enhancements
Email Notifications for job applications.

Search and sort job listings.

Pagination for applications.

Candidate profile management.

✨ Author
Developed by [Your Name Here] ✨
Feel free to contribute, suggest improvements, or raise issues.

🔥 Thank you for checking out this project! 🔥
