import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles, Trash2, ChevronRight, MessageSquare, Zap, GraduationCap, Briefcase } from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "../../lib/api";
import { cn } from "../../lib/utils";

export default function Coach() {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hello! I'm ScoutAI, your AI Career Coach. I've analyzed your profile and resume. How can I help you today? You can ask me about interview prep, project ideas, or how to improve your match score for a specific role.", timestamp: new Date() }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]); setInput(""); setLoading(true);
    try {
      const res = await api.post("/api/coach/chat", { message: input, history: messages.map(m => ({ role: m.role, content: m.content })) });
      setMessages(prev => [...prev, { role: "assistant", content: res.data.response, timestamp: new Date() }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm sorry, I encountered an error. Please try again.", timestamp: new Date() }]);
    } finally { setLoading(false); }
  };

  const suggestions = ["How can I improve my React skills?", "Suggest some project ideas for Backend roles", "Review my match score for SDE roles", "How to prepare for a System Design interview?"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div><h1 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: 4 }}>AI Career Coach</h1><p style={{ color: "#5a5a6b" }}>Personalized mentorship based on your career goals</p></div>
        <button onClick={() => setMessages([messages[0]])} style={{ padding: 8, color: "#8e8ea8", background: "none", border: "none", cursor: "pointer", transition: "color 0.3s" }} title="Clear Chat"
          onMouseEnter={e => e.currentTarget.style.color = "#f87171"} onMouseLeave={e => e.currentTarget.style.color = "#8e8ea8"}><Trash2 size={20} /></button>
      </div>

      <div style={{ flex: 1, display: "flex", gap: 24, overflow: "hidden" }}>
        {/* Chat */}
        <div className="glass-card" style={{ flex: 1, display: "flex", flexDirection: "column", padding: 0, overflow: "hidden", borderColor: "rgba(0, 0, 0,0.04)" }}>
          <div className="custom-scrollbar" style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", gap: 16, maxWidth: "85%", ...(msg.role === "user" ? { marginLeft: "auto", flexDirection: "row-reverse" } : {}) }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 4,
                  ...(msg.role === "assistant" ? { background: "rgba(0, 0, 0,0.1)", border: "1px solid rgba(0, 0, 0,0.1)", color: "#2e2e2e" } : { background: "rgba(0, 0, 0,0.04)", border: "1px solid rgba(0, 0, 0,0.06)", color: "#5a5a6b" }) }}>
                  {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div style={{ padding: 16, borderRadius: 16, fontSize: "0.875rem", lineHeight: 1.625,
                  ...(msg.role === "assistant" ? { background: "rgba(0, 0, 0,0.03)", color: "#373747", borderTopLeftRadius: 0 } : { background: "#000000", color: "#ffffff", borderTopRightRadius: 0, boxShadow: "0 4px 12px rgba(0, 0, 0,0.06)" }) }}>
                  <div className="markdown-content">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 16, maxWidth: "85%" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(0, 0, 0,0.06)", border: "1px solid rgba(0, 0, 0,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><Bot size={16} style={{ color: "#2e2e2e" }} /></div>
                <div style={{ padding: 16, borderRadius: 16, background: "rgba(0, 0, 0,0.03)", display: "flex", gap: 4 }}>
                  <div className="animate-bounce" style={{ width: 6, height: 6, borderRadius: "50%", background: "#8e8ea8" }} />
                  <div className="animate-bounce" style={{ width: 6, height: 6, borderRadius: "50%", background: "#8e8ea8", animationDelay: "0.2s" }} />
                  <div className="animate-bounce" style={{ width: 6, height: 6, borderRadius: "50%", background: "#8e8ea8", animationDelay: "0.4s" }} />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div style={{ padding: 16, borderTop: "1px solid rgba(0, 0, 0,0.04)", background: "rgba(0, 0, 0,0.01)" }}>
            <div style={{ display: "flex", gap: 12 }}>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask your career coach anything..."
                style={{ flex: 1, background: "rgba(0, 0, 0,0.03)", border: "1px solid rgba(0, 0, 0,0.06)", borderRadius: 12, padding: "12px 16px", fontSize: "0.875rem", color: "#000000", outline: "none", transition: "border-color 0.3s", fontFamily: "inherit" }}
                onFocus={e => e.target.style.borderColor = "rgba(0, 0, 0,0.3)"} onBlur={e => e.target.style.borderColor = "rgba(0, 0, 0,0.06)"} />
              <button onClick={handleSend} disabled={!input.trim() || loading}
                style={{ padding: 12, background: "#000000", borderRadius: 12, border: "none", color: "#ffffff", cursor: "pointer", transition: "background 0.3s", boxShadow: "0 4px 12px rgba(0, 0, 0,0.1)", opacity: (!input.trim() || loading) ? 0.5 : 1 }}><Send size={20} /></button>
            </div>
          </div>
        </div>

        {/* Suggestions Sidebar */}
        <div style={{ width: 320, display: "flex", flexDirection: "column", gap: 24, overflowY: "auto" }} className="custom-scrollbar">
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><Sparkles size={16} style={{ color: "#facc15" }} /> Try Asking</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => setInput(s)}
                  style={{ width: "100%", textAlign: "left", padding: 12, borderRadius: 12, background: "rgba(0, 0, 0,0.02)", border: "1px solid rgba(0, 0, 0,0.04)", fontSize: 11, color: "#5a5a6b", cursor: "pointer", transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "inherit" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(0, 0, 0,0.05)"; e.currentTarget.style.color = "#000000"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(0, 0, 0,0.02)"; e.currentTarget.style.color = "#5a5a6b"; }}>
                  {s}<ChevronRight size={12} />
                </button>
              ))}
            </div>
          </div>
          <div className="glass-card" style={{ padding: 24, background: "linear-gradient(135deg, rgba(0, 0, 0,0.03), rgba(0, 0, 0,0.03))" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, marginBottom: 16 }}>Coach Specializations</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[{ icon: <Zap size={14} style={{ color: "#facc15" }} />, label: "ATS Optimization" }, { icon: <Briefcase size={14} style={{ color: "#555555" }} />, label: "Interview Strategy" }, { icon: <GraduationCap size={14} style={{ color: "#2e2e2e" }} />, label: "Skill Roadmap" }, { icon: <MessageSquare size={14} style={{ color: "#333333" }} />, label: "Behavioral Prep" }].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: 8, borderRadius: 8, background: "rgba(0, 0, 0,0.02)" }}>
                  {item.icon}<span style={{ fontSize: 11, color: "#5a5a6b" }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
