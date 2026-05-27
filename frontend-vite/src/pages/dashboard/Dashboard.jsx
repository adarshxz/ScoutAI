import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import api from "../../lib/api";
import { Target, FileText, Zap, BarChart3, ArrowRight, Sparkles, History, Clock, Calendar } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ matchScore: "—", resumeScore: "—", skillsCount: 0, analysesCount: 0 });
  const [profileSteps, setProfileSteps] = useState([
    { label: "Account Created", done: true },
    { label: "Upload Resume", done: false },
    { label: "Add Projects", done: false },
    { label: "Connect GitHub", done: false },
  ]);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }
      setUser(session.user);

      // Fetch all dashboard data in parallel
      try {
        const [profileRes, historyRes, projectsRes] = await Promise.all([
          api.get("/api/profile/").catch(() => null),
          api.get("/api/profile/history").catch(() => null),
          api.get("/api/profile/projects").catch(() => null),
        ]);

        const profileData = profileRes?.data?.profile || null;
        const historyData = historyRes?.data?.history || [];
        const projectsData = projectsRes?.data?.projects || [];

        setProfile(profileData);
        setHistory(historyData);

        // Calculate stats from real data
        const resumeAnalyses = historyData.filter(h => h.action_type === "resume_analysis");
        const matchAnalyses = historyData.filter(h => h.action_type === "job_match");

        const latestResume = resumeAnalyses[0];
        const latestMatch = matchAnalyses[0];

        const resumeScore = latestResume?.metadata?.ats_score ?? "—";
        const matchScore = latestMatch?.metadata?.match_score ?? "—";
        const skillsCount = profileData?.skills?.length || 0;
        const analysesCount = historyData.length;

        setStats({ matchScore, resumeScore, skillsCount, analysesCount });

        // Dynamic profile completion
        const hasResume = resumeAnalyses.length > 0;
        const hasProjects = projectsData.length > 0;
        const hasGithub = !!profileData?.github_url;

        setProfileSteps([
          { label: "Account Created", done: true },
          { label: "Upload Resume", done: hasResume },
          { label: "Add Projects", done: hasProjects },
          { label: "Connect GitHub", done: hasGithub },
        ]);

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }

      setLoading(false);
    };
    init();
  }, [navigate]);

  const getIcon = (type) => {
    if (type === "resume_analysis") return <FileText style={{ color: "#555555" }} size={16} />;
    if (type === "job_match") return <Target style={{ color: "#2e2e2e" }} size={16} />;
    return <History style={{ color: "#8e8ea8" }} size={16} />;
  };

  const getLabel = (type) => {
    if (type === "resume_analysis") return "Resume Audit";
    if (type === "job_match") return "Match Check";
    if (type === "github_analysis") return "GitHub Analysis";
    return "Activity";
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
      <div className="spinner-indigo" />
    </div>
  );

  const recentHistory = history.slice(0, 5);
  const completedSteps = profileSteps.filter(s => s.done).length;
  const completionPercent = Math.round((completedSteps / profileSteps.length) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: 4 }}>
            Welcome back, <span className="gradient-text">{profile?.name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User"}</span>
          </h1>
          <p style={{ color: "#5a5a6b" }}>Your AI-powered career intelligence hub</p>
        </div>
        <Link to="/dashboard/resume" className="btn-primary" style={{ fontSize: "0.875rem" }}>
          <Sparkles size={16} /> New Analysis
        </Link>
      </div>

      {/* Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 40 }}>
        {[
          { label: "Match Score", value: stats.matchScore !== "—" ? `${stats.matchScore}%` : "—", icon: Target, desc: stats.matchScore !== "—" ? "Latest job match" : "Run your first analysis", color: "#2e2e2e" },
          { label: "Resume Score", value: stats.resumeScore !== "—" ? `${stats.resumeScore}%` : "—", icon: FileText, desc: stats.resumeScore !== "—" ? "Latest ATS score" : "Upload your resume", color: "#555555" },
          { label: "Skills Tracked", value: String(stats.skillsCount), icon: Zap, desc: stats.skillsCount > 0 ? "Skills in your profile" : "Add your skills", color: "#facc15" },
          { label: "Analyses Run", value: String(stats.analysesCount), icon: BarChart3, desc: stats.analysesCount > 0 ? "Total activities" : "Start matching", color: "#333333" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: "0.875rem", color: "#5a5a6b" }}>{stat.label}</span>
              <stat.icon size={20} style={{ color: stat.color }} />
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#000000", marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontSize: "0.75rem", color: "#8e8ea8" }}>{stat.desc}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700 }}>Recent Analyses</h3>
              <Link to="/dashboard/history" style={{ fontSize: "0.75rem", color: "#2e2e2e", display: "flex", alignItems: "center", gap: 4 }}>View all <ArrowRight size={12} /></Link>
            </div>
            {recentHistory.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {recentHistory.map((item) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 12, borderRadius: 12, background: "rgba(0, 0, 0,0.02)", border: "1px solid rgba(0, 0, 0,0.04)", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(0, 0, 0,0.04)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(0, 0, 0,0.02)"}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(0, 0, 0,0.03)", border: "1px solid rgba(0, 0, 0,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {getIcon(item.action_type)}
                      </div>
                      <div>
                        <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>{getLabel(item.action_type)}</div>
                        <div style={{ fontSize: "0.75rem", color: "#5a5a6b", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      {(item.metadata?.ats_score || item.metadata?.match_score) && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ height: 6, width: 48, background: "rgba(0, 0, 0,0.04)", borderRadius: 9999, overflow: "hidden" }}>
                            <div style={{ height: "100%", background: "#000000", width: `${item.metadata.ats_score || item.metadata.match_score}%` }} />
                          </div>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{item.metadata.ats_score || item.metadata.match_score}%</span>
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.625rem", color: "#8e8ea8" }}>
                        <Clock size={10} />
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 0", textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(0, 0, 0,0.03)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <History style={{ color: "#8e8ea8" }} size={32} />
                </div>
                <p style={{ color: "#5a5a6b", fontSize: "0.875rem" }}>No recent activity found.</p>
                <p style={{ fontSize: "0.75rem", color: "#8e8ea8", marginTop: 4 }}>Start by uploading your resume or project.</p>
              </div>
            )}
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 24 }}>Recommended for You</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ padding: 16, borderRadius: 12, border: "1px solid rgba(0, 0, 0,0.04)", background: "rgba(0, 0, 0,0.02)" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(0, 0, 0,0.04)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <Zap size={16} style={{ color: "#555555" }} />
                </div>
                <h4 style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: 4 }}>Skill Growth</h4>
                <p style={{ fontSize: "0.75rem", color: "#5a5a6b" }}>Learn Docker to increase your match score for Backend roles by 12%.</p>
              </div>
              <div style={{ padding: 16, borderRadius: 12, border: "1px solid rgba(0, 0, 0,0.04)", background: "rgba(0, 0, 0,0.02)" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(0, 0, 0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <Sparkles size={16} style={{ color: "#2e2e2e" }} />
                </div>
                <h4 style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: 4 }}>Resume Tip</h4>
                <p style={{ fontSize: "0.75rem", color: "#5a5a6b" }}>Add more quantification to your project bullet points to stand out.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="glass-card" style={{ padding: 24, background: "linear-gradient(135deg, rgba(0, 0, 0,0.06), rgba(0, 0, 0,0.04))", borderColor: "rgba(0, 0, 0,0.1)" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              AI Career Coach <Sparkles size={18} style={{ color: "#2e2e2e" }} />
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#5a5a6b", marginBottom: 24 }}>Ask me anything about your career path, interview prep, or project ideas.</p>
            <Link to="/dashboard/coach" className="btn-primary" style={{ width: "100%", fontSize: "0.875rem" }}>Start Chatting</Link>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700 }}>Complete Your Profile</h3>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: completionPercent === 100 ? "#22c55e" : "#2e2e2e" }}>{completionPercent}%</span>
            </div>
            {/* Progress bar */}
            <div style={{ height: 4, width: "100%", background: "rgba(0, 0, 0,0.06)", borderRadius: 9999, overflow: "hidden", marginBottom: 20 }}>
              <div style={{ height: "100%", background: completionPercent === 100 ? "#22c55e" : "linear-gradient(90deg, #000000, #444444)", width: `${completionPercent}%`, borderRadius: 9999, transition: "width 0.5s ease" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {profileSteps.map((step) => (
                <div key={step.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: step.done ? "#22c55e" : "rgba(0, 0, 0,0.1)" }} />
                  <span style={{ fontSize: "0.75rem", color: step.done ? "#5a5a6b" : "#8e8ea8", textDecoration: step.done ? "none" : "none" }}>{step.label}</span>
                  {step.done && <span style={{ fontSize: "0.625rem", color: "#22c55e", marginLeft: "auto" }}>✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
