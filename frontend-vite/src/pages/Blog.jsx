import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Newspaper, Clock, ArrowUpRight } from "lucide-react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

const posts = [
  { tag: "Career", title: "How to Land Your First Tech Internship in 2026", excerpt: "A step-by-step guide covering resume optimization, portfolio building, and interview strategies that actually work for students breaking into the industry.", date: "May 20, 2026", readTime: "8 min", color: "#2e2e2e" },
  { tag: "ATS", title: "Decoding ATS: Why 75% of Resumes Never Get Seen", excerpt: "Understanding how Applicant Tracking Systems filter resumes and actionable tips to ensure yours makes it past the bots and into a recruiter's hands.", date: "May 15, 2026", readTime: "6 min", color: "#555555" },
  { tag: "Skills", title: "Top 10 In-Demand Skills for Software Engineering Interns", excerpt: "Based on analysis of 10,000+ job postings, these are the technical and soft skills that hiring managers care about most in 2026.", date: "May 10, 2026", readTime: "5 min", color: "#facc15" },
  { tag: "Projects", title: "Building Projects That Actually Impress Recruiters", excerpt: "Not all side projects are created equal. Learn what makes a project stand out on your resume and how to present it effectively.", date: "May 5, 2026", readTime: "7 min", color: "#333333" },
  { tag: "Interview", title: "The Complete System Design Interview Guide for Interns", excerpt: "System design questions aren't just for seniors anymore. Here's how to prepare for the most common patterns asked at top companies.", date: "Apr 28, 2026", readTime: "10 min", color: "#333333" },
  { tag: "AI", title: "How AI is Changing the Hiring Landscape in 2026", excerpt: "From AI-powered screening to automated interviews, here's how artificial intelligence is reshaping recruitment and what candidates should know.", date: "Apr 22, 2026", readTime: "6 min", color: "#22c55e" },
];

export default function Blog() {
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
              <Newspaper size={24} style={{ color: "#2e2e2e" }} />
            </div>
            <h1 style={{ fontSize: "2.25rem", fontWeight: 700 }}>Blog</h1>
          </div>
          <p style={{ color: "#5a5a6b", fontSize: "1.125rem", marginBottom: 48, maxWidth: 600 }}>
            Insights, guides, and tips to accelerate your career in tech.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 24 }}>
            {posts.map((post, i) => (
              <motion.div key={post.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="glass-card" style={{ padding: 28, cursor: "pointer", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: post.color, background: `${post.color}15`, padding: "4px 10px", borderRadius: 6 }}>{post.tag}</span>
                  <ArrowUpRight size={16} style={{ color: "#8e8ea8" }} />
                </div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 8, lineHeight: 1.4 }}>{post.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#5a5a6b", lineHeight: 1.6, flex: 1, marginBottom: 20 }}>{post.excerpt}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: "0.75rem", color: "#8e8ea8" }}>
                  <span>{post.date}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {post.readTime}</span>
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
