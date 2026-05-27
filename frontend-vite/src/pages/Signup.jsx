import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email, password,
        options: { data: { name }, emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (authError) throw authError;
      if (data.user && !data.session) { navigate("/login?message=check-email"); } else { navigate("/dashboard"); }
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback` } });
      if (error) throw error;
    } catch (err) {
      setError(err.message || "Google signup failed.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "48px 16px" }}>
      <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />
      <div className="glow-orb animate-pulse-glow" style={{ width: 500, height: 500, background: "rgba(0, 0, 0,0.05)", top: -150, right: -100, position: "absolute" }} />
      <div className="glow-orb animate-pulse-glow" style={{ width: 400, height: 400, background: "rgba(0, 0, 0,0.06)", bottom: -100, left: -50, position: "absolute", animationDelay: "2s" }} />

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 448 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #000000, #999999)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(0, 0, 0,0.1)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
          </div>
          <span className="gradient-text" style={{ fontSize: "1.25rem", fontWeight: 700 }}>ScoutAI</span>
        </Link>

        <div className="glass-card" style={{ padding: "32px 40px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#000000", marginBottom: 8 }}>Create Account</h1>
            <p style={{ fontSize: "0.875rem", color: "#5a5a6b" }}>Start matching with your dream internships</p>
          </div>

          {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="alert-error" style={{ marginBottom: 24 }}>{error}</motion.div>}

          <button onClick={handleGoogleSignup} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "12px", borderRadius: 12, border: "1px solid rgba(0, 0, 0,0.06)", background: "rgba(0, 0, 0,0.02)", color: "#000000", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", transition: "background 0.3s", marginBottom: 24, fontFamily: "inherit" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(0, 0, 0,0.05)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(0, 0, 0,0.02)"}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(0, 0, 0,0.06)" }} />
            <span style={{ fontSize: "0.75rem", color: "#8e8ea8" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(0, 0, 0,0.06)" }} />
          </div>

          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#5a5a6b", marginBottom: 8 }}>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required className="input-glass" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#5a5a6b", marginBottom: 8 }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="input-glass" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#5a5a6b", marginBottom: 8 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} className="input-glass" style={{ paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#8e8ea8", cursor: "pointer" }}>
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#5a5a6b", marginBottom: 8 }}>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required className="input-glass" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "14px", marginTop: 8 }}>
              {loading ? <div className="spinner" /> : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#8e8ea8", marginTop: 24 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#2e2e2e", fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
