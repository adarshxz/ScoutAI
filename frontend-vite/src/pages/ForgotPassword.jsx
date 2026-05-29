import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/reset-password` });
      if (resetError) throw resetError;
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "0 16px" }}>
      <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />
      <div className="glow-orb animate-pulse-glow" style={{ width: 500, height: 500, background: "rgba(0, 0, 0,0.04)", top: -150, right: "10%", position: "absolute" }} />

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 448 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #000000, #999999)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(0, 0, 0,0.1)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
          </div>
          <span className="gradient-text" style={{ fontSize: "1.25rem", fontWeight: 700 }}>ScoutAI</span>
        </Link>

        <div className="glass-card" style={{ padding: "32px 40px" }}>
          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#000000", marginBottom: 8 }}>Check Your Email</h1>
              <p style={{ fontSize: "0.875rem", color: "#5a5a6b", marginBottom: 24 }}>
                We&apos;ve sent a password reset link to <strong style={{ color: "#000000" }}>{email}</strong>
              </p>
              <Link to="/login" className="btn-secondary" style={{ fontSize: "0.875rem" }}>Back to Sign In</Link>
            </motion.div>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#000000", marginBottom: 8 }}>Reset Password</h1>
                <p style={{ fontSize: "0.875rem", color: "#5a5a6b" }}>Enter your email and we&apos;ll send you a reset link</p>
              </div>

              {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="alert-error" style={{ marginBottom: 24 }}>{error}</motion.div>}

              <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#5a5a6b", marginBottom: 8 }}>Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="input-glass" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "14px" }}>
                  {loading ? <div className="spinner" /> : "Send Reset Link"}
                </button>
              </form>

              <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#8e8ea8", marginTop: 24 }}>
                Remember your password?{" "}
                <Link to="/login" style={{ color: "#2e2e2e", fontWeight: 500 }}>Sign in</Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
