import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, MapPin, GraduationCap, Calendar, Code, Globe, Plus, Trash2, Save, Briefcase } from "lucide-react";
import api from "../../lib/api";
import { cn } from "../../lib/utils";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [profile, setProfile] = useState({ name: "", email: "", bio: "", college: "", branch: "", graduation_year: null, skills: [], github_url: "", linkedin_url: "", portfolio_url: "", experience: "" });
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try { const res = await api.get("/api/profile/"); if (res.data.profile) setProfile(res.data.profile); } catch (err) { console.error("Error fetching profile:", err); } finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true); setMessage({ type: "", text: "" });
    try { await api.put("/api/profile/", profile); setMessage({ type: "success", text: "Profile updated successfully!" }); } catch { setMessage({ type: "error", text: "Failed to update profile." }); } finally { setSaving(false); }
  };

  const addSkill = () => { if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) { setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] }); setNewSkill(""); } };
  const removeSkill = (s) => setProfile({ ...profile, skills: profile.skills.filter(sk => sk !== s) });

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}><div className="spinner-indigo" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div><h1 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: 4 }}>My Profile</h1><p style={{ color: "#5a5a6b" }}>Manage your personal information and skills</p></div>
        <button onClick={handleSave} disabled={saving} className="btn-primary"><Save size={18} /> Save Changes</button>
      </div>

      {message.text && <div className={message.type === "success" ? "alert-success" : "alert-error"}>{message.text}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="glass-card" style={{ padding: 32 }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}><User size={20} style={{ color: "#2e2e2e" }} /> Basic Information</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#5a5a6b", marginBottom: 8 }}>Full Name</label><input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="input-glass" placeholder="Enter your name" /></div>
              <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#5a5a6b", marginBottom: 8 }}>Email Address</label><input type="email" value={profile.email || ""} disabled className="input-glass" style={{ opacity: 0.6, cursor: "not-allowed" }} /></div>
              <div style={{ gridColumn: "span 2" }}><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#5a5a6b", marginBottom: 8 }}>Bio</label><textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} className="input-glass" style={{ minHeight: 100 }} placeholder="Tell us about yourself..." /></div>
            </div>
          </div>
          <div className="glass-card" style={{ padding: 32 }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}><GraduationCap size={20} style={{ color: "#2e2e2e" }} /> Education</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#5a5a6b", marginBottom: 8 }}>College / University</label><input type="text" value={profile.college} onChange={(e) => setProfile({...profile, college: e.target.value})} className="input-glass" placeholder="University Name" /></div>
              <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#5a5a6b", marginBottom: 8 }}>Branch / Major</label><input type="text" value={profile.branch} onChange={(e) => setProfile({...profile, branch: e.target.value})} className="input-glass" placeholder="e.g. Computer Science" /></div>
              <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#5a5a6b", marginBottom: 8 }}>Graduation Year</label><input type="number" value={profile.graduation_year || ""} onChange={(e) => setProfile({...profile, graduation_year: parseInt(e.target.value) || null})} className="input-glass" placeholder="2025" /></div>
            </div>
          </div>
          <div className="glass-card" style={{ padding: 32 }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}><Briefcase size={20} style={{ color: "#2e2e2e" }} /> Experience & Summary</h3>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#5a5a6b", marginBottom: 8 }}>Work Experience Summary</label>
            <textarea value={profile.experience} onChange={(e) => setProfile({...profile, experience: e.target.value})} className="input-glass" style={{ minHeight: 150 }} placeholder="Summarize your internships, roles, and key responsibilities..." />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="glass-card" style={{ padding: 32 }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}><Code size={20} style={{ color: "#2e2e2e" }} /> Technical Skills</h3>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSkill()} className="input-glass" placeholder="Add skill..." />
              <button onClick={addSkill} style={{ padding: 12, background: "#000000", borderRadius: 12, border: "none", cursor: "pointer", color: "#000000" }}><Plus size={20} /></button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {profile.skills.map((skill) => (
                <span key={skill} style={{ padding: "6px 12px", background: "rgba(0, 0, 0,0.06)", border: "1px solid rgba(0, 0, 0,0.1)", borderRadius: 8, fontSize: "0.75rem", fontWeight: 500, color: "#2e2e2e", display: "flex", alignItems: "center", gap: 8 }}>
                  {skill}
                  <button onClick={() => removeSkill(skill)} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0 }}><Trash2 size={12} /></button>
                </span>
              ))}
              {profile.skills.length === 0 && <p style={{ fontSize: "0.75rem", color: "#8e8ea8" }}>No skills added yet.</p>}
            </div>
          </div>
          <div className="glass-card" style={{ padding: 32 }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 24 }}>Social Profiles</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label style={{ fontSize: "0.75rem", fontWeight: 500, color: "#5a5a6b", marginBottom: 8, display: "block" }}>GitHub</label><input type="text" value={profile.github_url} onChange={(e) => setProfile({...profile, github_url: e.target.value})} className="input-glass" style={{ fontSize: "0.75rem" }} placeholder="https://github.com/..." /></div>
              <div><label style={{ fontSize: "0.75rem", fontWeight: 500, color: "#5a5a6b", marginBottom: 8, display: "block" }}>LinkedIn</label><input type="text" value={profile.linkedin_url} onChange={(e) => setProfile({...profile, linkedin_url: e.target.value})} className="input-glass" style={{ fontSize: "0.75rem" }} placeholder="https://linkedin.com/in/..." /></div>
              <div><label style={{ fontSize: "0.75rem", fontWeight: 500, color: "#5a5a6b", marginBottom: 8, display: "block" }}>Portfolio</label><input type="text" value={profile.portfolio_url} onChange={(e) => setProfile({...profile, portfolio_url: e.target.value})} className="input-glass" style={{ fontSize: "0.75rem" }} placeholder="https://yourportfolio.com" /></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
