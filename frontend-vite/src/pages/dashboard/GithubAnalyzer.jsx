import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, GitFork, Sparkles, Code, AlertCircle, 
  CheckCircle2, RefreshCw, Cpu, User, BookOpen, Terminal
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import api from "../../lib/api";

const GithubIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function GithubAnalyzer() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const steps = [
    "Establishing secure handshake with GitHub API...",
    "Retrieving repository profile and metadata...",
    "Scanning language distributions & stargazers...",
    "Calculating portfolio activity score...",
    "Consulting Gemini AI Career Intelligence Engine...",
    "Finalizing code quality and level assessments..."
  ];

  useEffect(() => {
    const fetchExistingAnalysis = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("github_analysis")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1);

          if (!error && data && data.length > 0) {
            const latest = data[0];
            setResult({
              github_username: latest.github_username,
              total_repos: latest.total_repos,
              total_commits: latest.total_commits,
              languages: latest.languages,
              top_repos: latest.top_repos,
              activity_score: latest.activity_score,
              analysis: latest.analysis
            });
            setUsername(latest.github_username);
          }
        }
      } catch (err) {
        console.error("Error fetching existing github analysis:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExistingAnalysis();
  }, []);

  useEffect(() => {
    let timer;
    if (analyzing) {
      timer = setInterval(() => {
        setAnalysisStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          return prev;
        });
      }, 3000);
    } else {
      setAnalysisStep(0);
    }
    return () => clearInterval(timer);
  }, [analyzing]);

  const handleAnalyze = async () => {
    if (!username.trim()) return;
    setAnalyzing(true);
    setError("");
    setAnalysisStep(0);

    try {
      const res = await api.post("/api/profile/github/analyze", {
        github_username: username.trim()
      });
      setResult(res.data);
    } catch (err) {
      console.error("GitHub analysis failed:", err);
      setError(err.response?.data?.detail || "An error occurred while analyzing your GitHub profile. Please verify your username and try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const getLevelBadgeColor = (level) => {
    switch (level?.toLowerCase()) {
      case "senior": return "rgba(0, 0, 0,0.06)";
      case "mid-level": return "rgba(0, 0, 0,0.06)";
      default: return "rgba(34,197,94,0.15)";
    }
  };

  const getLevelTextColor = (level) => {
    switch (level?.toLowerCase()) {
      case "senior": return "#333333";
      case "mid-level": return "#555555";
      default: return "#4ade80";
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
        <div className="spinner-indigo" />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: 4 }}>GitHub Portfolio Analyzer</h1>
          <p style={{ color: "#5a5a6b" }}>Transform your public repositories into structured AI career intelligence</p>
        </div>
        {result && !analyzing && (
          <button onClick={() => { setResult(null); setUsername(""); }} className="btn-secondary" style={{ fontSize: "0.875rem" }}>
            <RefreshCw size={16} /> Analyze Different Profile
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!result && !analyzing ? (
          <motion.div 
            key="input-view" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            className="glass-card" 
            style={{ padding: 48, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: 640, margin: "0 auto", width: "100%" }}
          >
            <div style={{ width: 80, height: 80, borderRadius: 16, background: "rgba(0, 0, 0,0.06)", border: "1px solid rgba(0, 0, 0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
              <GithubIcon size={36} style={{ color: "#2e2e2e" }} />
            </div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 8 }}>Connect Your GitHub</h2>
            <p style={{ fontSize: "0.875rem", color: "#5a5a6b", marginBottom: 32, maxWidth: 380 }}>
              Enter your public GitHub username. We will analyze your repositories, commits, and languages to assess your tech stack.
            </p>
            <div style={{ display: "flex", gap: 12, width: "100%", maxWidth: 400 }}>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                className="input-glass" 
                placeholder="Enter GitHub Username (e.g. torvalds)" 
                style={{ flex: 1 }}
              />
              <button 
                onClick={handleAnalyze} 
                disabled={!username.trim()}
                className="btn-primary" 
                style={{ padding: "12px 24px" }}
              >
                Analyze
              </button>
            </div>
            {error && (
              <p style={{ marginTop: 24, fontSize: "0.875rem", color: "#f87171", display: "flex", alignItems: "center", gap: 8 }}>
                <AlertCircle size={16} /> {error}
              </p>
            )}
          </motion.div>
        ) : analyzing ? (
          <motion.div 
            key="loading-view" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }} 
            className="glass-card" 
            style={{ padding: 48, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: 640, margin: "0 auto", width: "100%" }}
          >
            <div className="spinner-indigo" style={{ width: 64, height: 64, marginBottom: 32 }} />
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 16 }}>Running AI Portfolio Analysis</h2>
            
            {/* Terminal Mock Progress */}
            <div style={{ width: "100%", background: "rgba(255, 255, 255, 0.2)", border: "1px solid rgba(0, 0, 0, 0.05)", borderRadius: 12, padding: 16, textAlign: "left", fontFamily: "monospace", fontSize: "0.75rem", color: "#2e2e2e", minHeight: 120, display: "flex", flexDirection: "column", gap: 8, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#8e8ea8" }}>
                <Terminal size={12} /> scout_ai_github_agent.sh --run
              </div>
              {steps.slice(0, analysisStep + 1).map((step, idx) => (
                <div key={idx} style={{ display: "flex", gap: 8, color: idx === analysisStep ? "#555555" : "#5a5a6b" }}>
                  <span>{idx === analysisStep ? "❯" : "✓"}</span>
                  <span style={{ flex: 1 }}>{step}</span>
                  {idx < analysisStep && <span style={{ color: "#22c55e" }}>[DONE]</span>}
                  {idx === analysisStep && <span className="animate-pulse" style={{ color: "#facc15" }}>[RUNNING]</span>}
                </div>
              ))}
            </div>
            
            <p style={{ marginTop: 24, fontSize: "0.75rem", color: "#8e8ea8" }}>
              This might take a moment as our agent crawls repository trees and structures LLM prompts.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="result-view" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            style={{ display: "flex", flexDirection: "column", gap: 32 }}
          >
            {/* Top Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 24 }}>
              {/* Profile Card */}
              <div className="glass-card" style={{ padding: 24, display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
                  <svg style={{ width: 80, height: 80, transform: "rotate(-90deg)" }} viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" stroke="rgba(0, 0, 0,0.06)" strokeWidth="8" fill="none" />
                    <motion.circle 
                      initial={{ strokeDashoffset: 314 }} 
                      animate={{ strokeDashoffset: 314 - (314 * result.activity_score) / 100 }} 
                      transition={{ duration: 1.5, ease: "easeOut" }} 
                      cx="60" cy="60" r="50" 
                      stroke="url(#gitGrad)" strokeWidth="8" fill="none" strokeDasharray="314" strokeLinecap="round" 
                    />
                    <defs>
                      <linearGradient id="gitGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#2e2e2e" />
                        <stop offset="100%" stopColor="#e0e0e0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                    <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#000000" }}>{result.activity_score}</span>
                    <span style={{ fontSize: 7, color: "#5a5a6b", textTransform: "uppercase", fontWeight: 700 }}>Activity</span>
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                    @{result.github_username}
                  </h3>
                  <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                    <span style={{ padding: "4px 8px", background: getLevelBadgeColor(result.analysis.estimated_level), color: getLevelTextColor(result.analysis.estimated_level), borderRadius: 6, fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {result.analysis.estimated_level}
                    </span>
                    <span style={{ padding: "4px 8px", background: "rgba(0, 0, 0,0.03)", border: "1px solid rgba(0, 0, 0,0.06)", color: "#5a5a6b", borderRadius: 6, fontSize: "0.625rem", fontWeight: 600 }}>
                      Level Assessment
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Card Repos */}
              <div className="glass-card" style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "#5a5a6b", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Public Repositories</span>
                <span style={{ fontSize: "1.875rem", fontWeight: 700, color: "#000000", display: "flex", alignItems: "center", gap: 8 }}>
                  <BookOpen size={24} style={{ color: "#2e2e2e" }} /> {result.total_repos}
                </span>
              </div>

              {/* Stats Card Commits */}
              <div className="glass-card" style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "#5a5a6b", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Commit Activity</span>
                <span style={{ fontSize: "1.875rem", fontWeight: 700, color: "#000000", display: "flex", alignItems: "center", gap: 8 }}>
                  <Cpu size={24} style={{ color: "#2e2e2e" }} /> ~{result.total_commits}
                </span>
              </div>
            </div>

            {/* Split Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 32 }}>
              {/* Left Column: Languages */}
              <div className="glass-card" style={{ padding: 32 }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
                  <Code size={20} style={{ color: "#2e2e2e" }} /> Language Diversity
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {Object.entries(result.languages).map(([lang, pct]) => (
                    <div key={lang}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: 8 }}>
                        <span style={{ color: "#373747", fontWeight: 600 }}>{lang}</span>
                        <span style={{ color: "#5a5a6b" }}>{pct}%</span>
                      </div>
                      <div style={{ height: 6, background: "rgba(0, 0, 0,0.04)", borderRadius: 9999, overflow: "hidden" }}>
                        <div style={{ height: "100%", background: "linear-gradient(90deg, #2e2e2e, #e0e0e0)", width: `${pct}%`, borderRadius: 9999 }} />
                      </div>
                    </div>
                  ))}
                  {Object.keys(result.languages).length === 0 && (
                    <p style={{ fontSize: "0.75rem", color: "#8e8ea8" }}>No public languages identified.</p>
                  )}
                </div>
              </div>

              {/* Right Column: AI Insights */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {/* Insights Summary Card */}
                <div className="glass-card" style={{ padding: 32 }}>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    <Sparkles size={20} style={{ color: "#facc15" }} /> AI Portfolio Insights
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "#373747", lineHeight: 1.625, marginBottom: 24 }}>
                    {result.analysis.tech_stack_summary}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                    <div>
                      <h4 style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#4ade80", marginBottom: 12 }}>Strengths</h4>
                      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                        {result.analysis.strengths.map((str, idx) => (
                          <li key={idx} style={{ display: "flex", gap: 8, fontSize: "0.75rem", color: "#5a5a6b", lineHeight: 1.5 }}>
                            <CheckCircle2 size={14} style={{ color: "#22c55e", flexShrink: 0, marginTop: 1 }} />
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#333333", marginBottom: 12 }}>Areas to Improve</h4>
                      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                        {result.analysis.areas_to_improve.map((arr, idx) => (
                          <li key={idx} style={{ display: "flex", gap: 8, fontSize: "0.75rem", color: "#5a5a6b", lineHeight: 1.5 }}>
                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#5a5a6b", flexShrink: 0, marginTop: 6 }} />
                            <span>{arr}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Best Project Highlight */}
                {result.analysis.project_highlight && (
                  <div className="glass-card" style={{ padding: 24, background: "linear-gradient(135deg, rgba(0, 0, 0,0.03), rgba(0, 0, 0,0.03))", borderColor: "rgba(0, 0, 0,0.1)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <User size={16} style={{ color: "#2e2e2e" }} />
                      <h4 style={{ fontSize: "0.875rem", fontWeight: 700 }}>Featured Project Highlight</h4>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#5a5a6b", lineHeight: 1.6, fontStyle: "italic" }}>
                      &ldquo;{result.analysis.project_highlight}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Row: Repository Grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700 }}>Analyzed Repositories</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {result.top_repos.map((repo, idx) => (
                  <div 
                    key={idx} 
                    className="glass-card" 
                    style={{ padding: 20, display: "flex", flexDirection: "column", minHeight: 160, transition: "transform 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#000000", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {repo.name}
                      </span>
                      {repo.url && (
                        <a href={repo.url} target="_blank" rel="noreferrer" style={{ color: "#2e2e2e", fontSize: "0.6875rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                          View <GithubIcon size={12} />
                        </a>
                      )}
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#5a5a6b", flex: 1, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {repo.description}
                    </p>
                    <div style={{ display: "flex", gap: 16, fontSize: "0.6875rem", color: "#8e8ea8", paddingTop: 16, borderTop: "1px solid rgba(0, 0, 0,0.04)", marginTop: 12 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Star size={12} /> {repo.stars} {repo.stars === 1 ? "star" : "stars"}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <GitFork size={12} /> {repo.forks} {repo.forks === 1 ? "fork" : "forks"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
