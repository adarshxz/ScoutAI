import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "0 16px" }}>
      <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />
      <div className="glow-orb animate-pulse-glow" style={{ width: 500, height: 500, background: "rgba(0, 0, 0,0.06)", top: -150, left: -100, position: "absolute" }} />
      <div className="glow-orb animate-pulse-glow" style={{ width: 400, height: 400, background: "rgba(0, 0, 0,0.04)", bottom: -100, right: -50, position: "absolute", animationDelay: "2s" }} />

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
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#000000", marginBottom: 8 }}>Welcome Back</h1>
            <p style={{ fontSize: "0.875rem", color: "#5a5a6b" }}>Sign in to continue to your dashboard</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="alert-error" style={{ marginBottom: 24 }}>{error}</motion.div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#5a5a6b", marginBottom: 8 }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="input-glass" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#5a5a6b" }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: "0.75rem", color: "#2e2e2e", transition: "color 0.3s" }}>Forgot password?</Link>
              </div>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="input-glass" style={{ paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#8e8ea8", cursor: "pointer", padding: 4, transition: "color 0.3s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#000000"} onMouseLeave={e => e.currentTarget.style.color = "#8e8ea8"}>
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "14px" }}>
              {loading ? <div className="spinner" /> : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#8e8ea8", marginTop: 24 }}>
            Don&apos;t have an account?{" "}
            <Link to="/signup" style={{ color: "#2e2e2e", fontWeight: 500, transition: "color 0.3s" }}>Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
