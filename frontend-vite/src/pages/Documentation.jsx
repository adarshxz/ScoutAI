import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ArrowLeft, Zap, FileText, Target, Bot, ChevronRight } from "lucide-react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

const GithubIcon = ({ size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);


const sections = [
  {
    icon: <Zap size={20} style={{ color: "#facc15" }} />,
    title: "Getting Started",
    desc: "Create an account, set up your profile, and run your first analysis in under 5 minutes.",
    steps: [
      "Sign up with your email or Google account",
      "Complete your profile with skills, education, and experience",
      "Upload your resume (PDF or DOCX) for AI-powered analysis",
      "Use the AI Match Engine to compare against job descriptions",
    ],
  },
  {
    icon: <FileText size={20} style={{ color: "#555555" }} />,
    title: "Resume Analyzer",
    desc: "Our AI evaluates your resume against real ATS systems used by top tech companies.",
    steps: [
      "Supports PDF and DOCX file formats",
      "Scores your resume on ATS compatibility (0–100%)",
      "Identifies strengths and areas for improvement",
      "Provides detailed pros/cons analysis with actionable bullet fixes",
    ],
  },
  {
    icon: <Target size={20} style={{ color: "#2e2e2e" }} />,
    title: "AI Match Engine",
    desc: "Paste a job description and get an instant compatibility score with skill gap analysis.",
    steps: [
      "Analyzes your profile, projects, GitHub, and resume data",
      "Generates an overall match score with category breakdowns",
      "Highlights missing skills and provides recommendations",
      "Tracks match history for progress monitoring",
    ],
  },
  {
    icon: <Bot size={20} style={{ color: "#333333" }} />,
    title: "ScoutAI Career Coach",
    desc: "Chat with your personal AI career coach for interview prep, project ideas, and more.",
    steps: [
      "Context-aware — knows your profile, skills, and resume score",
      "Get personalized career advice and skill roadmaps",
      "Practice behavioral and technical interview questions",
      "Receive project suggestions tailored to your target roles",
    ],
  },
  {
    icon: <GithubIcon size={20} style={{ color: "#17171c" }} />,
    title: "GitHub Integration",
    desc: "Connect your GitHub to auto-analyze your repositories, languages, and activity.",
    steps: [
      "Enter your GitHub username to fetch public profile data",
      "AI evaluates code quality, diversity, and commit activity",
      "Languages are auto-merged into your profile skills",
      "Activity score factors into your overall match calculations",
    ],
  },
];

export default function Documentation() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "120px 24px 80px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.875rem", color: "#2e2e2e", marginBottom: 32, transition: "opacity 0.3s" }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(0, 0, 0,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen size={24} style={{ color: "#2e2e2e" }} />
            </div>
            <h1 style={{ fontSize: "2.25rem", fontWeight: 700 }}>Documentation</h1>
          </div>
          <p style={{ color: "#5a5a6b", fontSize: "1.125rem", marginBottom: 48, maxWidth: 600 }}>
            Everything you need to know to get the most out of ScoutAI's career intelligence platform.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {sections.map((section, i) => (
              <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card" style={{ padding: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  {section.icon}
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>{section.title}</h2>
                </div>
                <p style={{ color: "#5a5a6b", fontSize: "0.875rem", marginBottom: 20, lineHeight: 1.6 }}>{section.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {section.steps.map((step, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <ChevronRight size={14} style={{ color: "#000000", marginTop: 3, flexShrink: 0 }} />
                      <span style={{ fontSize: "0.875rem", color: "#373747", lineHeight: 1.5 }}>{step}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
