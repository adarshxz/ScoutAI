import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { supabase } from "../../lib/supabase";
import {
  LayoutDashboard, UserCircle, Briefcase, FileText, Search,
  Target, History, MessageSquare, Settings, ChevronLeft, ChevronRight, LogOut,
} from "lucide-react";

const GithubIcon = ({ size = 20, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Profile", icon: UserCircle, href: "/dashboard/profile" },
  { label: "Projects", icon: Briefcase, href: "/dashboard/projects" },
  { label: "GitHub Analyzer", icon: GithubIcon, href: "/dashboard/github" },
  { label: "Resume Analyzer", icon: FileText, href: "/dashboard/resume" },
  { label: "Job Analyzer", icon: Search, href: "/dashboard/job" },
  { label: "History", icon: History, href: "/dashboard/history" },
  { label: "AI Coach", icon: MessageSquare, href: "/dashboard/coach" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="glass" style={{
      position: "relative", height: "100vh", borderRight: "1px solid rgba(0, 0, 0,0.04)",
      transition: "all 0.3s", display: "flex", flexDirection: "column",
      width: collapsed ? 80 : 256, zIndex: 100,
    }}>
      {/* Toggle */}
      <button onClick={() => setCollapsed(!collapsed)} style={{
        position: "absolute", right: -13, top: 40, width: 26, height: 26, borderRadius: "50%",
        background: "#000000", display: "flex", alignItems: "center", justifyContent: "center",
        color: "#ffffff", border: "1px solid rgba(255, 255, 255, 0.15)", cursor: "pointer", zIndex: 110, boxShadow: "0 4px 12px rgba(0, 0, 0,0.2)",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}>
        {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
      </button>

      {/* Logo */}
      <div style={{ padding: 24, marginBottom: 16 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, minWidth: 32, borderRadius: 8, background: "linear-gradient(135deg, #000000, #999999)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(0, 0, 0,0.1)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
          </div>
          {!collapsed && <span className="gradient-text" style={{ fontSize: "1.25rem", fontWeight: 700, whiteSpace: "nowrap" }}>ScoutAI</span>}
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} to={item.href}
              className={cn("sidebar-item", isActive && "sidebar-active")}
              style={isActive ? { color: "#2e2e2e" } : {}}>
              <item.icon size={20} style={isActive ? { color: "#2e2e2e" } : {}} />
              {!collapsed && <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: 16, borderTop: "1px solid rgba(0, 0, 0,0.04)" }}>
        <button onClick={handleLogout}
          className="sidebar-item" style={{ width: "100%", background: "none", border: "none", cursor: "pointer", ...(collapsed ? { justifyContent: "center", padding: "10px 0" } : {}) }}
          onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#5a5a6b"; e.currentTarget.style.background = "transparent"; }}>
          <LogOut size={20} />
          {!collapsed && <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Logout</span>}
        </button>
      </div>
    </div>
  );
}
