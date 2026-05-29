import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

const sections = [
  { title: "1. Information We Collect", content: "We collect information you provide directly, including your name, email address, resume data, skills, project details, and GitHub profile information. We also collect usage data such as feature interactions and analysis history to improve our services." },
  { title: "2. How We Use Your Information", content: "Your data is used to provide AI-powered career analysis, resume scoring, job matching, and personalized career coaching. We use your profile data to generate accurate match scores and recommendations. We do not sell your personal information to third parties." },
  { title: "3. AI Processing", content: "Your resume text, profile data, and job descriptions are sent to Google's Gemini AI for analysis. This processing is done in real-time and we do not store AI conversation logs beyond your session. AI-generated analyses (scores, recommendations) are stored in your account for history tracking." },
  { title: "4. Data Storage & Security", content: "Your data is stored securely using Supabase (powered by PostgreSQL) with row-level security policies. All data transmission is encrypted via HTTPS. Passwords are hashed and never stored in plain text. We implement industry-standard security practices to protect your information." },
  { title: "5. Data Retention", content: "Your account data is retained as long as your account is active. You can request deletion of your account and all associated data at any time by contacting us. Resume files are processed in memory and not permanently stored on our servers." },
  { title: "6. Third-Party Services", content: "We use the following third-party services: Supabase (authentication & database), Google Gemini AI (analysis & coaching), and GitHub API (profile analysis). Each service has its own privacy policy governing their use of data." },
  { title: "7. Your Rights", content: "You have the right to access, update, or delete your personal data at any time through your profile settings. You can export your data or request a complete account deletion by contacting our support team." },
  { title: "8. Updates to This Policy", content: "We may update this privacy policy from time to time. We will notify registered users of significant changes via email. Continued use of the platform after updates constitutes acceptance of the revised policy." },
];

export default function Privacy() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "120px 24px 80px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.875rem", color: "#2e2e2e", marginBottom: 32 }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={24} style={{ color: "#22c55e" }} />
            </div>
            <h1 style={{ fontSize: "2.25rem", fontWeight: 700 }}>Privacy Policy</h1>
          </div>
          <p style={{ color: "#8e8ea8", fontSize: "0.875rem", marginBottom: 48 }}>Last updated: May 24, 2026</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {sections.map((section, i) => (
              <motion.div key={section.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                style={{ paddingBottom: 24, borderBottom: "1px solid rgba(0, 0, 0,0.04)" }}>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 10 }}>{section.title}</h2>
                <p style={{ fontSize: "0.875rem", color: "#5a5a6b", lineHeight: 1.7 }}>{section.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
