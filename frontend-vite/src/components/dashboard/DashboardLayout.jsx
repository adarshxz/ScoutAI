import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Bell, Search, User, Menu } from "lucide-react";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#fafafc", overflow: "hidden" }}>
      {/* Backdrop for mobile sidebar drawer */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="md:hidden"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(4px)",
            zIndex: 90,
          }}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        {/* Topbar */}
        <header className="glass dashboard-header">
          <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
            {/* Hamburger menu button for mobile drawer */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden flex items-center justify-center"
              style={{ 
                background: "none", 
                border: "none", 
                cursor: "pointer", 
                padding: 8, 
                color: "#17171c" 
              }}
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>

            <div className="hidden md:block" style={{ position: "relative", maxWidth: 400, width: "100%" }}>
              <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#8e8ea8" }} size={18} />
              <input type="text" placeholder="Search analysis, skills..."
                style={{ width: "100%", background: "rgba(0, 0, 0,0.03)", border: "1px solid rgba(0, 0, 0,0.06)", borderRadius: 12, padding: "8px 16px 8px 40px", fontSize: "0.875rem", color: "#17171c", outline: "none", transition: "border-color 0.3s", fontFamily: "inherit" }}
                onFocus={e => e.target.style.borderColor = "rgba(0, 0, 0,0.3)"}
                onBlur={e => e.target.style.borderColor = "rgba(0, 0, 0,0.06)"} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button style={{ padding: 8, color: "#5a5a6b", background: "none", border: "none", cursor: "pointer", position: "relative", transition: "color 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#000000"} onMouseLeave={e => e.currentTarget.style.color = "#5a5a6b"}>
              <Bell size={20} />
              <span style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, background: "#000000", borderRadius: "50%", border: "2px solid #fafafc" }} />
            </button>
            <div style={{ height: 32, width: 1, background: "rgba(0, 0, 0,0.04)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="hidden md:block" style={{ textAlign: "right" }}>
                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#000000", lineHeight: 1, margin: 0 }}>Career Coach</p>
                <p style={{ fontSize: 10, color: "#2e2e2e", fontWeight: 500, marginTop: 4, margin: 0 }}>PRO PLAN</p>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #000000, #999999)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0, 0, 0,0.1)", boxShadow: "0 4px 12px rgba(255, 255, 255,0.2)" }}>
                <User size={20} style={{ color: "#000000" }} />
              </div>
            </div>
          </div>
        </header>
        <main className="custom-scrollbar dashboard-main">
          <div style={{ maxWidth: 1152, margin: "0 auto" }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
