import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, MapPin, Send, MessageCircle } from "lucide-react";
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

const LinkedinIcon = ({ size = 20, style }) => (
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
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

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
              <MessageCircle size={24} style={{ color: "#2e2e2e" }} />
            </div>
            <h1 style={{ fontSize: "2.25rem", fontWeight: 700 }}>Contact Us</h1>
          </div>
          <p style={{ color: "#5a5a6b", fontSize: "1.125rem", marginBottom: 48, maxWidth: 600 }}>
            Have a question, feedback, or partnership idea? We'd love to hear from you.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            {/* Contact Form */}
            <div className="glass-card" style={{ padding: 32 }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 24 }}>Send a Message</h2>
              {sent && <div className="alert-success" style={{ marginBottom: 16 }}>Message sent successfully! We'll get back to you soon.</div>}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <input className="input-glass" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input className="input-glass" type="email" placeholder="Your Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                <input className="input-glass" placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
                <textarea className="input-glass" placeholder="Your Message" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required style={{ resize: "vertical" }} />
                <button type="submit" className="btn-primary" style={{ width: "100%" }}><Send size={16} /> Send Message</button>
              </form>
            </div>

            {/* Contact Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="glass-card" style={{ padding: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0, 0, 0,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Mail size={18} style={{ color: "#555555" }} />
                  </div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Email</h3>
                </div>
                <p style={{ fontSize: "0.875rem", color: "#5a5a6b" }}>support@scoutai.dev</p>
              </div>
              <div className="glass-card" style={{ padding: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0, 0, 0,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MapPin size={18} style={{ color: "#2e2e2e" }} />
                  </div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Location</h3>
                </div>
                <p style={{ fontSize: "0.875rem", color: "#5a5a6b" }}>Built remotely from India 🇮🇳</p>
              </div>
              <div className="glass-card" style={{ padding: 28 }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 16 }}>Connect with Us</h3>
                <div style={{ display: "flex", gap: 12 }}>
                  <a href="#" style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(0, 0, 0,0.04)", border: "1px solid rgba(0, 0, 0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: "#5a5a6b", transition: "all 0.3s" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#000000"; e.currentTarget.style.borderColor = "rgba(0, 0, 0,0.15)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#5a5a6b"; e.currentTarget.style.borderColor = "rgba(0, 0, 0,0.06)"; }}>
                    <GithubIcon size={18} />
                  </a>
                  <a href="#" style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(0, 0, 0,0.04)", border: "1px solid rgba(0, 0, 0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: "#5a5a6b", transition: "all 0.3s" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#000000"; e.currentTarget.style.borderColor = "rgba(0, 0, 0,0.15)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#5a5a6b"; e.currentTarget.style.borderColor = "rgba(0, 0, 0,0.06)"; }}>
                    <LinkedinIcon size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
