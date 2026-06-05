# ScoutAI — AI-Powered Career Intelligence & Resume Analysis Platform

ScoutAI is a career analysis and resume optimization platform designed to help students and early-career developers improve their resumes, analyze their GitHub portfolios, and match with their dream roles using Gemini AI.

---

## 🛠️ Project Structure
* **`/backend`**: FastAPI application with integrations for Gemini AI, Supabase Auth/Database, and resume parsing.
* **`/frontend-vite`**: React + Vite + Tailwind CSS/Vanilla CSS web application for the interactive candidate dashboard.

---

## 📋 Prerequisites
Before running the project, ensure you have the following installed:
* **Python 3.10+**
* **Node.js 18+**
* **npm** (comes with Node.js)

---

## 🚀 Getting Started

Follow these steps to run both the backend and frontend services locally.

### 1. Backend Setup & Run (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   * **macOS/Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
   * **Windows:**
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   * Create a `.env` file in the `backend` directory (you can copy `.env.example` as a template):
     ```bash
     cp .env.example .env
     ```
   * Open `.env` and fill in the required values:
     * `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`: Your Supabase database credentials.
     * `GEMINI_API_KEY`: Your Gemini API key (generate one for free on [Google AI Studio](https://aistudio.google.com/)).
     * `GEMINI_MODEL`: (Optional) Defaults to `gemini-3.5-flash` for fastest performance.

5. Start the backend development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   * The API docs will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

### 2. Frontend Setup & Run (React + Vite)

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend-vite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   * Create a `.env` file in the `frontend-vite` directory:
     ```env
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     VITE_API_URL=http://localhost:8000
     ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   * Open your browser and navigate to [http://localhost:5173](http://localhost:5173).

---

## 🔑 Key Features
* **AI Resume Parser & ATS Grader**: Evaluates resumes, gives ATS readability scores, and rewrites bullet points.
* **GitHub Portfolio Intelligence**: Analyzes tech stacks, calculates repository-based activity metrics, and identifies candidate strengths.
* **AI Career Coach**: Interactive chat interface powered by Gemini to provide personalized career progression advice.
* **Job Matching Engine**: Cross-references a candidate's profile/skills with job descriptions to compute detailed fit alignment.
