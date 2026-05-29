import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Scale } from "lucide-react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

const sections = [
  { title: "1. Acceptance of Terms", content: "By accessing or using ScoutAI ('the Platform'), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform. These terms apply to all users, including visitors, registered users, and contributors." },
  { title: "2. Account Registration", content: "To use certain features, you must create an account with accurate and complete information. You are responsible for maintaining the security of your account credentials. You must be at least 16 years old to create an account. One person may not maintain more than one account." },
  { title: "3. Acceptable Use", content: "You agree to use the Platform only for lawful purposes. You may not upload malicious content, attempt to gain unauthorized access, use automated scrapers, or abuse the AI services. You may not use ScoutAI to generate misleading or fraudulent resume content." },
  { title: "4. AI-Generated Content", content: "ScoutAI uses artificial intelligence to generate analyses, scores, and recommendations. While we strive for accuracy, AI outputs are advisory in nature and should not be treated as guaranteed outcomes. You are responsible for reviewing and verifying any AI-generated suggestions before using them." },
  { title: "5. Intellectual Property", content: "The Platform, including its design, features, and code, is the intellectual property of ScoutAI. Your uploaded content (resumes, profile data, projects) remains your property. By uploading content, you grant us a limited license to process it for the purposes of providing our services." },
  { title: "6. Service Availability", content: "We strive to maintain high availability but do not guarantee uninterrupted service. We may modify, suspend, or discontinue features at any time. Scheduled maintenance will be communicated in advance when possible. Free tier services may have rate limits and usage caps." },
  { title: "7. Limitation of Liability", content: "ScoutAI is provided 'as is' without warranties of any kind. We are not liable for decisions made based on AI analyses, lost opportunities, or damages arising from use of the Platform. Our total liability is limited to the amount you paid for the service in the 12 months preceding the claim." },
  { title: "8. Termination", content: "We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time, which will result in the permanent removal of your data. Upon termination, your right to use the Platform ceases immediately." },
  { title: "9. Changes to Terms", content: "We may update these terms from time to time. Material changes will be communicated via email to registered users. Continued use after changes constitutes acceptance. If you disagree with updated terms, you should discontinue use and delete your account." },
  { title: "10. Governing Law", content: "These terms are governed by the laws of India. Any disputes shall be resolved through binding arbitration. By using the Platform, you consent to the jurisdiction of courts located in India for any legal proceedings." },
];

export default function Terms() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "120px 24px 80px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.875rem", color: "#2e2e2e", marginBottom: 32 }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(250,204,21,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Scale size={24} style={{ color: "#facc15" }} />
            </div>
            <h1 style={{ fontSize: "2.25rem", fontWeight: 700 }}>Terms of Service</h1>
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
