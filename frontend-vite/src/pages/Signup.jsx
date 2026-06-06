import { useState, useEffect } from "react";
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

  useEffect(() => {
    // Check if the user is already authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

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
