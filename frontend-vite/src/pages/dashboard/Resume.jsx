import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Zap, Star, Sparkles } from "lucide-react";
import { supabase } from "../../lib/supabase";
import api from "../../lib/api";

export default function Resume() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      if (!["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(f.type)) { setError("Only PDF and DOCX files are allowed"); return; }
      setFile(f); setError("");
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setUploading(true); setError("");
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");
      const fileExt = file.name.split(".").pop();
      const fileName = `${userData.user.id}/${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("resumes").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("resumes").getPublicUrl(fileName);
      setUploading(false); setAnalyzing(true);
      const res = await api.post("/api/resume/analyze", { file_url: urlData.publicUrl, file_name: file.name, file_type: fileExt });
      setResult(res.data);
    } catch (err) { setError(err.message || "An error occurred"); } finally { setUploading(false); setAnalyzing(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div><h1 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: 4 }}>AI Resume Analyzer</h1><p style={{ color: "#5a5a6b" }}>Upload your resume and get an instant recruiter-level breakdown</p></div>

      {!result ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 48, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: 640, margin: "0 auto", width: "100%" }}>
          <div style={{ width: 80, height: 80, borderRadius: 16, background: "rgba(0, 0, 0,0.06)", border: "1px solid rgba(0, 0, 0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}><Upload size={32} style={{ color: "#2e2e2e" }} /></div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 8 }}>Upload Your Resume</h2>
          <p style={{ fontSize: "0.875rem", color: "#5a5a6b", marginBottom: 32, maxWidth: 320 }}>We support PDF and DOCX formats. Our AI will analyze your structure, grammar, and ATS compatibility.</p>
          <label style={{ cursor: "pointer" }}>
            <input type="file" style={{ display: "none" }} onChange={handleFileChange} accept=".pdf,.docx" />
            <div className="btn-primary" style={{ padding: "16px 40px" }}>{file ? file.name : "Select File"} <ArrowRight size={18} /></div>
          </label>
          {file && !analyzing && !uploading && <button onClick={handleAnalyze} style={{ marginTop: 24, fontSize: "0.875rem", color: "#2e2e2e", fontWeight: 600, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>Analyze this file <CheckCircle2 size={16} /></button>}
          {error && <p style={{ marginTop: 24, fontSize: "0.875rem", color: "#f87171", display: "flex", alignItems: "center", gap: 8 }}><AlertCircle size={16} /> {error}</p>}
          {(uploading || analyzing) && (
            <div style={{ marginTop: 40, width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#5a5a6b" }}><span>{uploading ? "Uploading to secure storage..." : "AI is analyzing your content..."}</span><span>{uploading ? "45%" : "85%"}</span></div>
              <div style={{ height: 6, width: "100%", background: "rgba(0, 0, 0,0.03)", borderRadius: 9999, overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: uploading ? "45%" : "85%" }} style={{ height: "100%", background: "#000000", boxShadow: "0 0 10px rgba(0, 0, 0,0.3)" }} />
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            <div className="glass-card" style={{ padding: 24, display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ position: "relative", width: 96, height: 96, flexShrink: 0 }}>
                <svg style={{ width: 96, height: 96, transform: "rotate(-90deg)" }} viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" stroke="rgba(0, 0, 0,0.06)" strokeWidth="8" fill="none" /><motion.circle initial={{ strokeDashoffset: 314 }} animate={{ strokeDashoffset: 314 - (314 * result.ats_score) / 100 }} transition={{ duration: 1.5, ease: "easeOut" }} cx="60" cy="60" r="50" stroke="url(#atsGrad)" strokeWidth="8" fill="none" strokeDasharray="314" strokeLinecap="round" /><defs><linearGradient id="atsGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#000000" /><stop offset="100%" stopColor="#444444" /></linearGradient></defs></svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}><span style={{ fontSize: "1.5rem", fontWeight: 700, color: "#000000" }}>{result.ats_score}%</span><span style={{ fontSize: 8, color: "#8e8ea8", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.1em" }}>ATS Score</span></div>
              </div>
              <div><h3 style={{ fontSize: "1.125rem", fontWeight: 700 }}>Overall Score</h3><p style={{ fontSize: "0.75rem", color: "#5a5a6b", lineHeight: 1.625 }}>Your resume is better than {result.percentile || "78"}% of candidates.</p></div>
            </div>
            <div className="glass-card" style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontSize: "0.75rem", color: "#5a5a6b", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Readability</span><span style={{ fontSize: "0.75rem", color: "#4ade80", fontWeight: 700 }}>{result.readability_score || "High"}</span></div>
              <div style={{ height: 4, background: "rgba(0, 0, 0,0.04)", borderRadius: 9999, overflow: "hidden", marginBottom: 16 }}><div style={{ height: "100%", background: "#22c55e", width: "92%" }} /></div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontSize: "0.75rem", color: "#5a5a6b", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Grammar</span><span style={{ fontSize: "0.75rem", color: "#2e2e2e", fontWeight: 700 }}>{result.grammar_score || "95/100"}</span></div>
              <div style={{ height: 4, background: "rgba(0, 0, 0,0.04)", borderRadius: 9999, overflow: "hidden" }}><div style={{ height: "100%", background: "#000000", width: "95%" }} /></div>
            </div>
            <div className="glass-card" style={{ padding: 24, background: "linear-gradient(135deg, rgba(0, 0, 0,0.06), rgba(0, 0, 0,0.04))", borderColor: "rgba(0, 0, 0,0.1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <Sparkles style={{ color: "#2e2e2e", marginBottom: 8 }} size={24} />
              <h4 style={{ fontSize: "0.875rem", fontWeight: 700 }}>Recruiter Recommendation</h4>
              <p style={{ fontSize: 11, color: "#5a5a6b", marginTop: 4, fontStyle: "italic" }}>&ldquo;Strong technical foundation. Recommended for Tier-1 internships.&rdquo;</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div className="glass-card" style={{ padding: 32 }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><Zap size={20} style={{ color: "#facc15" }} /> Key Strengths</h3>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>{result.strengths?.map((s, i) => <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: "0.875rem", color: "#373747" }}><CheckCircle2 size={16} style={{ color: "#22c55e", flexShrink: 0, marginTop: 2 }} />{s}</li>)}</ul>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginTop: 32, marginBottom: 16, display: "flex", alignItems: "center", gap: 8, color: "#f87171" }}><AlertCircle size={20} /> Areas to Improve</h3>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>{result.weaknesses?.map((w, i) => <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: "0.875rem", color: "#373747" }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f87171", flexShrink: 0, marginTop: 6 }} />{w}</li>)}</ul>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div className="glass-card" style={{ padding: 32, borderColor: "rgba(0, 0, 0,0.1)" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}><Star size={20} style={{ color: "#2e2e2e" }} /> AI Bullet Point Fixer</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>{result.bullet_fixes?.map((fix, i) => (
                  <div key={i} style={{ padding: 16, borderRadius: 12, background: "rgba(0, 0, 0,0.02)", border: "1px solid rgba(0, 0, 0,0.04)" }}>
                    <div style={{ fontSize: 10, color: "rgba(248,113,113,0.7)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Before</div>
                    <p style={{ fontSize: "0.75rem", color: "#5a5a6b", fontStyle: "italic", textDecoration: "line-through" }}>{fix.before}</p>
                    <div style={{ height: 1, background: "rgba(0, 0, 0,0.04)", margin: "8px 0" }} />
                    <div style={{ fontSize: 10, color: "rgba(74,222,128,0.7)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>After AI Rewrite</div>
                    <p style={{ fontSize: "0.875rem", color: "#000000", fontWeight: 500 }}>{fix.after}</p>
                  </div>
                ))}</div>
                <button className="btn-secondary" style={{ width: "100%", marginTop: 24, fontSize: "0.75rem" }}><RefreshCw size={14} /> Rewrite All Bullet Points</button>
              </div>
              <div className="glass-card" style={{ padding: 32 }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 16 }}>Skill Gap Discovery</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{result.missing_skills?.map((skill) => <span key={skill} style={{ padding: "6px 12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, fontSize: "0.75rem", fontWeight: 500, color: "#f87171" }}>{skill}</span>)}</div>
                <p style={{ fontSize: "0.75rem", color: "#8e8ea8", marginTop: 16 }}>Adding these skills could increase your visibility for <strong>{result.role_type || "SDE"}</strong> roles.</p>
              </div>
            </div>
          </div>

          {result.detailed_analysis && (
            <div className="glass-card" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <FileText style={{ color: "#2e2e2e" }} size={24} />
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Detailed AI Analysis</h3>
              </div>

              <div>
                <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#000000", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Executive Summary</h4>
                <p style={{ fontSize: "0.875rem", color: "#373747", lineHeight: 1.6 }}>{result.detailed_analysis.executive_summary}</p>
              </div>

              <div style={{ height: 1, background: "rgba(0, 0, 0,0.04)" }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                <div>
                  <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#4ade80", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><CheckCircle2 size={16} /> Pros Analysis</h4>
                  <p style={{ fontSize: "0.875rem", color: "#373747", lineHeight: 1.6 }}>{result.detailed_analysis.pros_analysis}</p>
                </div>
                <div>
                  <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f87171", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><AlertCircle size={16} /> Cons & Recommendations</h4>
                  <p style={{ fontSize: "0.875rem", color: "#373747", lineHeight: 1.6 }}>{result.detailed_analysis.cons_analysis}</p>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", paddingTop: 32 }}><button onClick={() => setResult(null)} className="btn-secondary">Analyze New Resume</button></div>
        </motion.div>
      )}
    </div>
  );
}
