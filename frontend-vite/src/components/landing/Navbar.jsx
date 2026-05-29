import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "/#features" },
    { label: "How it Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/#pricing" },
  ];

  return (
    <motion.nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        height: "auto",
        minHeight: 64,
        transition: "all 0.5s",
        ...(scrolled ? { borderBottom: "1px solid rgba(0, 0, 0, 0.04)", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)" } : {}),
      }}
      className={scrolled ? "glass" : ""}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#000000", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(0, 0, 0,0.1)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span style={{ fontSize: "1.125rem", fontWeight: 700, letterSpacing: "-0.025em" }}>
            <span className="gradient-text">ScoutAI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="md:flex hidden">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.href} className="nav-link" style={{ fontSize: "0.875rem", color: "#5a5a6b", transition: "color 0.3s" }}
              onMouseEnter={e => e.target.style.color = "#000000"}
              onMouseLeave={e => e.target.style.color = "#5a5a6b"}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="md:flex hidden">
          <Link to="/login" style={{ fontSize: "0.875rem", color: "#5a5a6b", padding: "8px 16px", transition: "color 0.3s" }}
            onMouseEnter={e => e.target.style.color = "#000000"}
            onMouseLeave={e => e.target.style.color = "#5a5a6b"}
          >
            Sign In
          </Link>
          <Link to="/signup" className="btn-primary" style={{ fontSize: "0.875rem", padding: "10px 20px" }}>
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          style={{ width: 40, height: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, background: "none", border: "none", cursor: "pointer" }}
          aria-label="Toggle mobile menu"
        >
          <motion.span animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} style={{ width: 20, height: 2, background: "rgba(0, 0, 0,0.7)", display: "block" }} />
          <motion.span animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }} style={{ width: 20, height: 2, background: "rgba(0, 0, 0,0.7)", display: "block" }} />
          <motion.span animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} style={{ width: 20, height: 2, background: "rgba(0, 0, 0,0.7)", display: "block" }} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass"
            style={{ borderTop: "1px solid rgba(0, 0, 0,0.04)", overflow: "hidden" }}
          >
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
              {navLinks.map((link) => (
                <Link key={link.label} to={link.href} onClick={() => setMobileOpen(false)} style={{ color: "#5a5a6b", padding: "8px 0", transition: "color 0.3s" }}>
                  {link.label}
                </Link>
              ))}
              <hr style={{ border: "none", borderTop: "1px solid rgba(0, 0, 0,0.06)" }} />
              <Link to="/login" style={{ color: "#5a5a6b", padding: "8px 0" }}>Sign In</Link>
              <Link to="/signup" className="btn-primary" style={{ textAlign: "center", fontSize: "0.875rem" }}>Get Started Free</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
