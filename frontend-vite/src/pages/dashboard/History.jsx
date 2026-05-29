import { useEffect, useState } from "react";
import { History as HistoryIcon, FileText, Target, Calendar, Clock, ArrowUpRight } from "lucide-react";
import api from "../../lib/api";
import { cn } from "../../lib/utils";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetch = async () => { try { const res = await api.get("/api/profile/history"); setHistory(res.data.history); } catch (err) { console.error(err); } finally { setLoading(false); } };
    fetch();
  }, []);

  const filtered = history.filter(item => {
    if (filter === "all") return true;
    if (filter === "resume") return item.action_type === "resume_analysis";
    if (filter === "match") return item.action_type === "job_match";
    return true;
  });

  const getIcon = (type) => {
    if (type === "resume_analysis") return <FileText style={{ color: "#555555" }} size={18} />;
    if (type === "job_match") return <Target style={{ color: "#2e2e2e" }} size={18} />;
    return <HistoryIcon style={{ color: "#8e8ea8" }} size={18} />;
  };

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}><div className="spinner-indigo" /></div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div><h1 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: 4 }}>Activity History</h1><p style={{ color: "#5a5a6b" }}>Keep track of all your past analyses and matches</p></div>
        <div style={{ display: "flex", background: "rgba(0, 0, 0,0.03)", padding: 4, borderRadius: 12, border: "1px solid rgba(0, 0, 0,0.04)" }}>
          {["all", "resume", "match"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "6px 16px", borderRadius: 8, fontSize: "0.75rem", fontWeight: 500, textTransform: "capitalize", border: "none", cursor: "pointer", transition: "all 0.3s", fontFamily: "inherit",
                ...(filter === f ? { background: "#000000", color: "#000000", boxShadow: "0 4px 12px rgba(0, 0, 0,0.1)" } : { background: "transparent", color: "#5a5a6b" })
              }}>{f}</button>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0, 0, 0,0.04)", background: "rgba(0, 0, 0,0.01)" }}>
                {["Action", "Details", "Score", "Date", ""].map((h) => (
                  <th key={h} style={{ padding: "16px 24px", fontSize: "0.75rem", fontWeight: 700, color: "#8e8ea8", textTransform: "uppercase", letterSpacing: "0.05em", ...(h === "" ? { textAlign: "right" } : {}) }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid rgba(0, 0, 0,0.04)", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0, 0, 0,0.02)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(0, 0, 0,0.03)", border: "1px solid rgba(0, 0, 0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{getIcon(item.action_type)}</div>
                      <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{item.action_type === "resume_analysis" ? "Resume Audit" : "Match Check"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "16px 24px" }}><div style={{ fontSize: "0.875rem", color: "#5a5a6b", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div></td>
                  <td style={{ padding: "16px 24px" }}>
                    {(item.metadata?.ats_score || item.metadata?.match_score) ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ height: 6, width: 64, background: "rgba(0, 0, 0,0.04)", borderRadius: 9999, overflow: "hidden" }}><div style={{ height: "100%", background: "#000000", width: `${item.metadata.ats_score || item.metadata.match_score}%` }} /></div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{item.metadata.ats_score || item.metadata.match_score}%</span>
                      </div>
                    ) : <span style={{ fontSize: "0.75rem", color: "#8e8ea8" }}>N/A</span>}
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem" }}><Calendar size={12} style={{ color: "#8e8ea8" }} />{new Date(item.created_at).toLocaleDateString()}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#8e8ea8", marginTop: 2 }}><Clock size={10} />{new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                  </td>
                  <td style={{ padding: "16px 24px", textAlign: "right" }}>
                    <button style={{ padding: 8, color: "#8e8ea8", background: "none", border: "none", cursor: "pointer", borderRadius: 8, transition: "all 0.3s" }}
                      onMouseEnter={e => { e.currentTarget.style.color = "#2e2e2e"; e.currentTarget.style.background = "rgba(0, 0, 0,0.06)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "#8e8ea8"; e.currentTarget.style.background = "transparent"; }}>
                      <ArrowUpRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: "80px 0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <HistoryIcon style={{ color: "#8e8ea8", marginBottom: 16 }} size={40} />
              <p style={{ color: "#5a5a6b", fontSize: "0.875rem" }}>No activity found for this filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
