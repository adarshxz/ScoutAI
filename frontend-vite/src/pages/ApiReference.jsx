import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Code2, Lock } from "lucide-react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

const endpoints = [
  {
    group: "Authentication",
    color: "#22c55e",
    routes: [
      { method: "POST", path: "/api/auth/signup", desc: "Register a new user account with email and password" },
      { method: "POST", path: "/api/auth/login", desc: "Authenticate user and return a session token" },
      { method: "POST", path: "/api/auth/logout", desc: "Invalidate the current session" },
    ],
  },
  {
    group: "Profile",
    color: "#555555",
    routes: [
      { method: "GET", path: "/api/profile/", desc: "Get the authenticated user's full profile" },
      { method: "PUT", path: "/api/profile/", desc: "Update profile fields (name, skills, bio, etc.)" },
      { method: "GET", path: "/api/profile/projects", desc: "List all projects for the current user" },
      { method: "POST", path: "/api/profile/projects", desc: "Create a new project entry" },
      { method: "POST", path: "/api/profile/github/analyze", desc: "Analyze a GitHub profile and save results" },
      { method: "GET", path: "/api/profile/history", desc: "Get full activity history" },
    ],
  },
  {
    group: "Resume Analysis",
    color: "#2e2e2e",
    routes: [
      { method: "POST", path: "/api/resume/analyze", desc: "Upload and analyze a resume with AI (ATS scoring, pros/cons)" },
      { method: "GET", path: "/api/resume/history", desc: "Get all past resume analyses" },
    ],
  },
  {
    group: "Match Engine",
    color: "#333333",
    routes: [
      { method: "POST", path: "/api/match/analyze", desc: "Compare user profile against a job description" },
    ],
  },
  {
    group: "Career Coach",
    color: "#facc15",
    routes: [
      { method: "POST", path: "/api/coach/chat", desc: "Send a message to the AI career coach with conversation history" },
    ],
  },
];

const methodColors = { GET: "#22c55e", POST: "#555555", PUT: "#facc15", DELETE: "#f87171" };

export default function ApiReference() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "120px 24px 80px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.875rem", color: "#2e2e2e", marginBottom: 32 }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(0, 0, 0,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Code2 size={24} style={{ color: "#2e2e2e" }} />
            </div>
            <h1 style={{ fontSize: "2.25rem", fontWeight: 700 }}>API Reference</h1>
          </div>
          <p style={{ color: "#5a5a6b", fontSize: "1.125rem", marginBottom: 16, maxWidth: 600 }}>
            Complete reference for the ScoutAI REST API. All endpoints require authentication unless noted.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "rgba(0, 0, 0,0.06)", border: "1px solid rgba(0, 0, 0,0.1)", borderRadius: 8, marginBottom: 48 }}>
            <Lock size={14} style={{ color: "#2e2e2e" }} />
            <span style={{ fontSize: "0.75rem", color: "#2e2e2e", fontWeight: 600 }}>Base URL: http://localhost:8000</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {endpoints.map((group, i) => (
              <motion.div key={group.group} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card" style={{ padding: 28, overflow: "hidden" }}>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: group.color }} />
                  {group.group}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {group.routes.map((route) => (
                    <div key={route.path + route.method} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 10, background: "rgba(0, 0, 0,0.02)", border: "1px solid rgba(0, 0, 0,0.04)" }}>
                      <span style={{ fontSize: "0.625rem", fontWeight: 800, padding: "3px 8px", borderRadius: 4, background: `${methodColors[route.method]}15`, color: methodColors[route.method], fontFamily: "monospace", minWidth: 40, textAlign: "center" }}>{route.method}</span>
                      <code style={{ fontSize: "0.8rem", color: "#17171c", fontFamily: "monospace", flexShrink: 0 }}>{route.path}</code>
                      <span style={{ fontSize: "0.8rem", color: "#8e8ea8", marginLeft: "auto", textAlign: "right" }}>{route.desc}</span>
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
