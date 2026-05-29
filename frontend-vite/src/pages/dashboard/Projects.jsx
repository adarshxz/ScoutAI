import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ExternalLink, Trash2, Users, Briefcase, AlertCircle } from "lucide-react";
import api from "../../lib/api";

const GithubIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const formatUrl = (url) => {
  if (!url) return "#";
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "", tech_stack: [], github_link: "", live_demo_link: "", role: "", team_size: 1, category: "Web Development" });
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    const fetch = async () => { try { const res = await api.get("/api/profile/projects"); setProjects(res.data.projects); } catch (err) { console.error(err); } finally { setLoading(false); } };
    fetch();
  }, []);

  const handleAdd = async () => {
    try { const res = await api.post("/api/profile/projects", newProject); setProjects([res.data.project, ...projects]); setShowModal(false); setNewProject({ title: "", description: "", tech_stack: [], github_link: "", live_demo_link: "", role: "", team_size: 1, category: "Web Development" }); } catch (err) { console.error(err); }
  };

  const addTech = () => { if (techInput.trim() && !newProject.tech_stack?.includes(techInput.trim())) { setNewProject({ ...newProject, tech_stack: [...(newProject.tech_stack || []), techInput.trim()] }); setTechInput(""); } };

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}><div className="spinner-indigo" /></div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div><h1 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: 4 }}>My Projects</h1><p style={{ color: "#5a5a6b" }}>Showcase your best work and hackathon wins</p></div>
        <button onClick={() => setShowModal(true)} className="btn-primary"><Plus size={18} /> Add Project</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
        {projects.map((project) => (
          <motion.div key={project.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ display: "flex", flexDirection: "column", padding: 24 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(0, 0, 0,0.03)", border: "1px solid rgba(0, 0, 0,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}><Briefcase size={20} style={{ color: "#2e2e2e" }} /></div>
              <div style={{ display: "flex", gap: 8 }}>
                {project.github_link && <a href={formatUrl(project.github_link)} target="_blank" rel="noreferrer" style={{ padding: 8, color: "#8e8ea8", display: "flex", alignItems: "center" }}><GithubIcon size={18} /></a>}
                {project.live_demo_link && <a href={formatUrl(project.live_demo_link)} target="_blank" rel="noreferrer" style={{ padding: 8, color: "#8e8ea8", display: "flex", alignItems: "center" }}><ExternalLink size={18} /></a>}
              </div>
            </div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 8 }}>{project.title}</h3>
            <p style={{ fontSize: "0.875rem", color: "#5a5a6b", marginBottom: 24, flex: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{project.description}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {project.tech_stack.map(tech => <span key={tech} style={{ padding: "4px 8px", background: "rgba(0, 0, 0,0.03)", border: "1px solid rgba(0, 0, 0,0.06)", borderRadius: 6, fontSize: 10, color: "#5a5a6b" }}>{tech}</span>)}
            </div>
            <div style={{ paddingTop: 16, borderTop: "1px solid rgba(0, 0, 0,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "#8e8ea8" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={12} /> {project.team_size} {project.team_size === 1 ? "Member" : "Members"}</span>
              <span style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, color: "rgba(0, 0, 0,0.5)" }}>{project.category}</span>
            </div>
          </motion.div>
        ))}
        {projects.length === 0 && (
          <div style={{ gridColumn: "1 / -1", padding: "80px 0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(0, 0, 0,0.03)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><AlertCircle style={{ color: "#8e8ea8" }} size={32} /></div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 4 }}>No projects yet</h3>
            <p style={{ color: "#5a5a6b", fontSize: "0.875rem", marginBottom: 24, maxWidth: 280 }}>Add your projects to show off your technical depth and stand out.</p>
            <button onClick={() => setShowModal(true)} className="btn-secondary" style={{ fontSize: "0.875rem" }}>Add Your First Project</button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} style={{ position: "absolute", inset: 0, background: "rgba(255, 255, 255,0.6)", backdropFilter: "blur(4px)" }} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card" style={{ position: "relative", width: "100%", maxWidth: 672, padding: 32, overflowY: "auto", maxHeight: "90vh" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 24 }}>Add New Project</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
                <div style={{ gridColumn: "span 2" }}><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#5a5a6b", marginBottom: 8 }}>Project Title</label><input type="text" value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} className="input-glass" placeholder="e.g. AI Match Analyzer" /></div>
                <div style={{ gridColumn: "span 2" }}><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#5a5a6b", marginBottom: 8 }}>Description</label><textarea value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} className="input-glass" style={{ minHeight: 100 }} placeholder="Describe the problem, solution and impact..." /></div>
                <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#5a5a6b", marginBottom: 8 }}>GitHub Link</label><input type="text" value={newProject.github_link} onChange={(e) => setNewProject({...newProject, github_link: e.target.value})} className="input-glass" placeholder="https://github.com/..." /></div>
                <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#5a5a6b", marginBottom: 8 }}>Live Demo</label><input type="text" value={newProject.live_demo_link} onChange={(e) => setNewProject({...newProject, live_demo_link: e.target.value})} className="input-glass" placeholder="https://demo.com" /></div>
                <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#5a5a6b", marginBottom: 8 }}>Tech Stack</label><div style={{ display: "flex", gap: 8 }}><input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTech()} className="input-glass" placeholder="React, Node..." /><button onClick={addTech} style={{ padding: 12, background: "rgba(0, 0, 0,0.03)", border: "1px solid rgba(0, 0, 0,0.06)", borderRadius: 12, cursor: "pointer", color: "#000000" }}><Plus size={18} /></button></div><div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>{newProject.tech_stack?.map(t => <span key={t} style={{ padding: "4px 8px", background: "rgba(0, 0, 0,0.06)", border: "1px solid rgba(0, 0, 0,0.1)", borderRadius: 6, fontSize: 10, color: "#2e2e2e" }}>{t}</span>)}</div></div>
                <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#5a5a6b", marginBottom: 8 }}>Category</label><select value={newProject.category} onChange={(e) => setNewProject({...newProject, category: e.target.value})} className="input-glass"><option>Web Development</option><option>Mobile App</option><option>AI/Machine Learning</option><option>Blockchain</option><option>DevOps</option><option>Other</option></select></div>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <button onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button onClick={handleAdd} className="btn-primary" style={{ flex: 1 }}>Add Project</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
