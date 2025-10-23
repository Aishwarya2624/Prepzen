# PrepZen — AI-Powered Mock Interview Platform

PrepZen is an AI-driven mock interview platform designed to help students and professionals prepare for technical and behavioral interviews. It provides realistic AI interviewer simulations, performance analytics, and feedback to enhance users’ confidence and readiness for real interviews.

🧑‍🏫 Demo Tutorial
Here’s how you can experience PrepZen in action:


https://github.com/user-attachments/assets/44ea9a46-214c-4139-aa3b-014ece20d680



🚀 Features

✅ AI Mock Interviews — Get personalized interview sessions with an AI interviewer for multiple domains.
✅ Question Bank & Difficulty Levels — Questions adapt dynamically to your skill level and chosen role.
✅ Speech-to-Text Support — Practice answering questions verbally, just like a real interview.
✅ Instant Feedback — Get AI-generated insights on your tone, clarity, and content quality.
✅ Resume-based Interview Mode — Upload your resume, and the AI give ATS score.

| Layer               | Technology                                     |
| ------------------- | ---------------------------------------------- |
| **Frontend**        | React + Vite + TailwindCSS                     |
| **Backend**         | Node.js + Express                              |
| **Database**        |  Firebase: Authentication ,Mongodb: Storage    |
| **AI Engine**       | OpenRouter / Gemini API integration            |
| **Package Manager** | pnpm                                           |

🛠️ Installation Guide
1. Clone the Repository
git clone https://github.com/your-username/prepzen.git
cd prepzen

2. Install Dependencies
pnpm install

3. Setup Environment Variables

Create a .env file in the project root:

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
MONGO_URI=

VITE_GOOGLE_GENAI_API_KEY=
VITE_OPENROUTER_API_KEY=

4. Run the App
pnpm dev

If you see an error like 'vite' is not recognized, run:
pnpm add vite -D

Then try again:
pnpm dev
