import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Lightbulb, FileText, Users, Code, Briefcase, GraduationCap, Rocket } from "lucide-react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

const tips = [
  {
    icon: <FileText size={20} />, color: "#555555", title: "Resume Optimization",
    items: [
      "Use action verbs: Built, Designed, Implemented — not 'Responsible for'",
      "Quantify impact: 'Improved load time by 40%' beats 'Optimized performance'",
      "Keep it to one page — recruiters spend 6–8 seconds on a first pass",
      "Tailor your resume for each role using keywords from the job description",
      "Use a clean, ATS-friendly format — avoid tables, images, and fancy columns",
    ],
  },
  {
    icon: <Code size={20} />, color: "#2e2e2e", title: "Technical Skills",
    items: [
      "Master one language deeply before learning many — depth beats breadth",
      "Build full-stack projects that solve real problems, not tutorial clones",
      "Learn Git properly — clean commit history shows professionalism",
      "Practice Data Structures & Algorithms on LeetCode (aim for 150+ problems)",
      "Contribute to open source — even documentation fixes count",
    ],
  },
  {
    icon: <Users size={20} />, color: "#333333", title: "Interview Preparation",
    items: [
      "Use the STAR method for behavioral questions (Situation, Task, Action, Result)",
      "Think out loud during coding interviews — communication matters as much as code",
      "Prepare 3 strong project stories you can discuss in depth",
      "Research the company's tech stack and recent blog posts before interviews",
      "Mock interviews with peers are the single best way to improve",
    ],
  },
  {
    icon: <Briefcase size={20} />, color: "#facc15", title: "Job Search Strategy",
    items: [
      "Apply early — many internship programs fill positions on a rolling basis",
      "Target 20–30 quality applications over 100 generic ones",
      "Use LinkedIn to connect with recruiters and engineers at target companies",
      "Attend hackathons and tech meetups — many companies recruit from events",
      "Follow up after applying with a brief, personalized message",
    ],
  },
  {
    icon: <GraduationCap size={20} />, color: "#22c55e", title: "Skill Development",
    items: [
      "Learn by building — tutorials are starting points, not destinations",
      "Pick adjacent skills that complement your stack (e.g., Docker for backend devs)",
      "Write about what you learn — blog posts and READMEs reinforce knowledge",
      "Stay current with industry trends through newsletters and podcasts",
      "Focus on fundamentals (networking, OS, databases) — frameworks change, concepts don't",
    ],
  },
  {
    icon: <Rocket size={20} />, color: "#333333", title: "Standing Out",
    items: [
      "Have a polished portfolio site — first impressions matter",
      "Create a strong GitHub profile with pinned repos and a professional README",
      "Participate in competitive programming or CTF challenges",
      "Write technical blog posts — it demonstrates depth and communication skills",
      "Mentor others — teaching is the best way to solidify your own knowledge",
    ],
  },
];

export default function CareerTips() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "120px 24px 80px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.875rem", color: "#2e2e2e", marginBottom: 32 }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(250,204,21,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lightbulb size={24} style={{ color: "#facc15" }} />
            </div>
            <h1 style={{ fontSize: "2.25rem", fontWeight: 700 }}>Career Tips</h1>
          </div>
          <p style={{ color: "#5a5a6b", fontSize: "1.125rem", marginBottom: 48, maxWidth: 600 }}>
            Actionable advice to help you land your dream internship and grow as a developer.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 24 }}>
            {tips.map((tip, i) => (
              <motion.div key={tip.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="glass-card" style={{ padding: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${tip.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: tip.color }}>{tip.icon}</div>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 700 }}>{tip.title}</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {tip.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: tip.color, marginTop: 7, flexShrink: 0 }} />
                      <span style={{ fontSize: "0.875rem", color: "#373747", lineHeight: 1.6 }}>{item}</span>
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
