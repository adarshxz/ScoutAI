import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, CheckCircle2, AlertTriangle, Brain, ClipboardList } from "lucide-react";
import api from "../../lib/api";
import { cn } from "../../lib/utils";

export default function Job() {
  const [jdText, setJdText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleMatch = async () => {
    if (!jdText.trim()) return;
    setAnalyzing(true);
    try { const res = await api.post("/api/match/analyze", { jd_text: jdText }); setResult(res.data); } catch (err) { console.error(err); } finally { setAnalyzing(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div><h1 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: 4 }}>AI Match Engine</h1><p style={{ color: "#5a5a6b" }}>Paste a job description to see how well you match</p></div>

      {!result ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(0, 0, 0,0.06)", border: "1px solid rgba(0, 0, 0,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><ClipboardList size={20} style={{ color: "#2e2e2e" }} /></div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Internship/Job Description</h2>
          </div>
          <textarea value={jdText} onChange={(e) => setJdText(e.target.value)} placeholder="Paste the full job description here (responsibilities, requirements, etc.)..." className="input-glass" style={{ minHeight: 300, fontSize: "0.875rem", lineHeight: 1.625, marginBottom: 24 }} />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={handleMatch} disabled={analyzing || !jdText.trim()} className="btn-primary" style={{ padding: "16px 32px" }}>
              {analyzing ? <><div className="spinner" /> Engine is Thinking...</> : <><Sparkles size={18} /> Calculate Match Score</>}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div className="glass-card" style={{ padding: 40, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", background: "linear-gradient(135deg, rgba(0, 0, 0,0.06), rgba(0, 0, 0,0.04))", borderColor: "rgba(0, 0, 0,0.1)" }}>
            <div style={{ position: "relative", width: 160, height: 160, marginBottom: 24 }}>
              <svg style={{ width: 160, height: 160, transform: "rotate(-90deg)" }} viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" stroke="rgba(0, 0, 0,0.05)" strokeWidth="10" fill="none" /><motion.circle initial={{ strokeDashoffset: 339 }} animate={{ strokeDashoffset: 339 - (339 * result.overall_score) / 100 }} transition={{ duration: 2, ease: "easeOut" }} cx="60" cy="60" r="54" stroke="url(#matchG)" strokeWidth="10" fill="none" strokeDasharray="339" strokeLinecap="round" /><defs><linearGradient id="matchG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#000000" /><stop offset="100%" stopColor="#333333" /></linearGradient></defs></svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}><span style={{ fontSize: "2.25rem", fontWeight: 700 }}>{result.overall_score}%</span><span style={{ fontSize: "0.75rem", color: "#555555", fontWeight: 700, letterSpacing: "0.1em", marginTop: 4 }}>MATCH</span></div>
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 8 }}>{result.overall_score > 80 ? "Perfect Match Found!" : result.overall_score > 60 ? "Strong Contender" : "Potential Match"}</h2>
            <p style={{ color: "#5a5a6b", maxWidth: 480, fontSize: "0.875rem", lineHeight: 1.625 }}>{result.summary || "Our AI engine has analyzed your profile against this role."}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div className="glass-card" style={{ padding: 32 }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}><Brain size={20} style={{ color: "#2e2e2e" }} /> Scoring Breakdown</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                  {[{ label: "Skills Alignment", pct: result.skills_score, color: "#000000" }, { label: "Project Relevance", pct: result.projects_score, color: "#444444" }, { label: "GitHub Context", pct: result.github_score, color: "#333333" }, { label: "Resume Quality", pct: result.resume_score, color: "#777777" }].map((s) => (
                    <div key={s.label}><div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: 8 }}><span style={{ color: "#5a5a6b", fontWeight: 500 }}>{s.label}</span><span style={{ color: "#000000", fontWeight: 700 }}>{s.pct}%</span></div><div style={{ height: 6, background: "rgba(0, 0, 0,0.04)", borderRadius: 9999, overflow: "hidden" }}><motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} style={{ height: "100%", borderRadius: 9999, background: s.color }} /></div></div>
                  ))}
                </div>
              </div>
              <div className="glass-card" style={{ padding: 32 }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 24 }}>Why You Match</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{result.strengths?.map((s, i) => <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: 16, borderRadius: 12, background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.1)" }}><CheckCircle2 size={18} style={{ color: "#4ade80", flexShrink: 0, marginTop: 2 }} /><p style={{ fontSize: "0.875rem", color: "#373747" }}>{s}</p></div>)}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div className="glass-card" style={{ padding: 32, borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.02)" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 8, color: "#f87171" }}><AlertTriangle size={20} /> Skill Gaps</h3>
                <p style={{ fontSize: "0.75rem", color: "#5a5a6b", marginBottom: 24 }}>The role requires these skills which aren&apos;t clearly highlighted in your profile.</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{result.missing_skills?.map((skill) => <span key={skill} style={{ padding: "6px 12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, fontSize: 11, fontWeight: 500, color: "#f87171" }}>{skill}</span>)}</div>
              </div>
              <div className="glass-card" style={{ padding: 32 }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><Zap size={20} style={{ color: "#facc15" }} /> Action Roadmap</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{result.recommendations?.map((rec, i) => <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}><div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(0, 0, 0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#2e2e2e", fontWeight: 700, flexShrink: 0, marginTop: 2, border: "1px solid rgba(0, 0, 0,0.1)" }}>{i + 1}</div><p style={{ fontSize: "0.75rem", color: "#5a5a6b", lineHeight: 1.625 }}>{rec}</p></div>)}</div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 32 }}><button onClick={() => setResult(null)} className="btn-secondary">Check Another Job</button></div>
        </motion.div>
      )}
    </div>
  );
}
