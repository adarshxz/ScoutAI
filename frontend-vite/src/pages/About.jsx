import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Rocket, Heart, Zap } from "lucide-react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

const values = [
  { icon: <Rocket size={24} />, color: "#2e2e2e", title: "Mission-Driven", desc: "We believe every student deserves equal access to career intelligence — regardless of their college, background, or network." },
  { icon: <Heart size={24} />, color: "#333333", title: "Student-First", desc: "ScoutAI is built by students, for students. Every feature is designed around real pain points in the internship hunt." },
  { icon: <Zap size={24} />, color: "#facc15", title: "AI-Powered", desc: "We leverage cutting-edge AI to provide personalized, actionable insights that go far beyond generic career advice." },
];

const team = [
  { name: "Adarsh Singh", role: "Founder & Full-Stack Developer", avatar: "AS", color: "#000000" },
];

export default function About() {
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
              <Users size={24} style={{ color: "#2e2e2e" }} />
            </div>
            <h1 style={{ fontSize: "2.25rem", fontWeight: 700 }}>About ScoutAI</h1>
          </div>
          <p style={{ color: "#5a5a6b", fontSize: "1.125rem", marginBottom: 48, maxWidth: 650, lineHeight: 1.7 }}>
            ScoutAI is an AI-powered career intelligence platform that helps students and early-career developers land top-tier internships by analyzing resumes, matching skills to job descriptions, and providing personalized mentorship — all powered by advanced AI.
          </p>

          {/* Values */}
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 24 }}>Our Values</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 20, marginBottom: 56 }}>
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card" style={{ padding: 28, textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${v.color}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: v.color }}>{v.icon}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 8 }}>{v.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#5a5a6b", lineHeight: 1.6 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Team */}
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 24 }}>The Team</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card" style={{ padding: 28, textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${member.color}, ${member.color}80)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: "1.125rem", fontWeight: 700, color: "#000000" }}>{member.avatar}</div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 4 }}>{member.name}</h4>
                <p style={{ fontSize: "0.75rem", color: "#5a5a6b" }}>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
