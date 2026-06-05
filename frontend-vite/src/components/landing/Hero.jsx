import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, GitBranch, Check, Cpu, Star, Code, Terminal, MessageSquare } from "lucide-react";

export default function Hero() {
  // 3D Tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate relative mouse position from center of element (-0.5 to 0.5)
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Maximum rotation values (e.g. 10 degrees max rotation)
    const rX = -(mouseY / height) * 10;
    const rY = (mouseX / width) * 10;

    setTilt({ x: rX, y: rY });
  };

  const handleMouseLeave = () => {
    // Smooth reset tilt back to zero
    setTilt({ x: 0, y: 0 });
  };

  // Framer Motion variants for floating overlays
  const float1 = {
    animate: {
      y: [0, -12, 0],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    }
  };

  const float2 = {
    animate: {
      y: [0, 10, 0],
      transition: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
    }
  };

  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", paddingTop: 100, paddingBottom: 80 }}>
      {/* Premium Spotlight Grid Background */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "radial-gradient(circle at center, transparent 20%, #ffffff 85%), linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px)",
        backgroundSize: "100% 100%, 60px 60px, 60px 60px",
        zIndex: 0
      }} />

      {/* Background Soft Glow Orbs */}
      <div className="glow-orb animate-pulse-glow" style={{ width: 600, height: 600, background: "rgba(0,0,0,0.015)", top: -150, left: "-10%", position: "absolute" }} />
      <div className="glow-orb animate-pulse-glow" style={{ width: 500, height: 500, background: "rgba(0,0,0,0.012)", bottom: -100, right: "-10%", position: "absolute", animationDelay: "2s" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>



        {/* Large Sleek Title */}
        <h1
          style={{
            fontSize: "clamp(2.3rem, 6.5vw, 4.8rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            marginBottom: 20,
            color: "#000000",
            textAlign: "center",
            maxWidth: 900
          }}
        >
          Match Your <span style={{ background: "linear-gradient(135deg, #000000 30%, #666666 90%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Potential</span>,<br />
          Not Just Your <span style={{ borderBottom: "3px solid #000000", paddingBottom: 2 }}>Keywords</span>.
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "clamp(0.95rem, 1.65vw, 1.15rem)",
            color: "#5a5a6b",
            maxWidth: 640,
            margin: "0 auto 30px",
            lineHeight: 1.6,
            textAlign: "center"
          }}
        >
          Go beyond simple keyword indexing. Our semantic match engine scans your actual projects, skills, and GitHub commits to surface matching opportunities built for your skill level.
        </p>

        {/* Primary and Secondary CTAs */}
        <div
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 56 }}
        >
          <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link to="/signup" className="btn-primary" style={{ fontSize: "0.95rem", padding: "12px 30px", boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}>
              Get Started Free <ArrowRight size={17} />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
            <a href="#features" className="btn-secondary" style={{ fontSize: "0.95rem", padding: "12px 30px" }}>
              How it Works
            </a>
          </motion.div>
        </div>

        {/* Dynamic Interactive Product Mockup Area with 3D Tilt */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 1100,
            minHeight: 480,
            margin: "0 auto",
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)"
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Decorative Floating Card 1 (Left side) - Layered with translateZ */}
          <motion.div
            variants={float1}
            animate="animate"
            style={{
              position: "absolute",
              left: -70,
              top: 60,
              zIndex: 30,
              width: 220,
              display: "none",
              transformStyle: "preserve-3d",
            }}
            className="md:block"
          >
            <div
              className="glass-card"
              style={{
                padding: 18,
                background: "rgba(255, 255, 255, 0.9)",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                backdropFilter: "blur(12px)",
                transform: "translateZ(50px)" /* Pops forward along the Z axis */
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ padding: 8, background: "rgba(0,0,0,0.04)", borderRadius: 8 }}>
                  <GitBranch size={16} style={{ color: "#000000" }} />
                </div>
                <div>
                  <h4 style={{ fontSize: "0.75rem", fontWeight: 700 }}>GitHub Scanner</h4>
                  <p style={{ fontSize: "0.625rem", color: "#8e8ea8" }}>Active Scan Complete</p>
                </div>
              </div>
              <div style={{ height: 1, background: "rgba(0,0,0,0.06)", marginBottom: 10 }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6875rem", color: "#5a5a6b" }}>
                <span>Scanned Repos</span>
                <strong style={{ color: "#000" }}>8 Projects</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6875rem", color: "#5a5a6b", marginTop: 4 }}>
                <span>Code Activity</span>
                <strong style={{ color: "#22c55e" }}>Excellent</strong>
              </div>
            </div>
          </motion.div>

          {/* Decorative Floating Card 2 (Right side) - Layered with translateZ */}
          <motion.div
            variants={float2}
            animate="animate"
            style={{
              position: "absolute",
              right: -60,
              bottom: 80,
              zIndex: 30,
              width: 200,
              display: "none",
              transformStyle: "preserve-3d",
            }}
            className="md:block"
          >
            <div
              className="glass-card"
              style={{
                padding: 18,
                background: "rgba(255, 255, 255, 0.9)",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                backdropFilter: "blur(12px)",
                transform: "translateZ(80px)" /* Pops forward even more */
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ padding: 6, background: "rgba(34, 197, 94, 0.1)", borderRadius: "50%" }}>
                  <Check size={14} style={{ color: "#22c55e" }} />
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>ATS Optimized</span>
              </div>
              <p style={{ fontSize: "0.6875rem", color: "#5a5a6b", lineHeight: 1.4 }}>
                Skills mapped directly to job descriptions with 94% alignment.
              </p>
            </div>
          </motion.div>

          {/* Main Mockup Window Container - translateZ slightly lower */}
          <div
            className="gradient-border"
            style={{
              padding: 1,
              background: "linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.02), rgba(0,0,0,0.1))",
              borderRadius: 16,
              boxShadow: "0 30px 70px rgba(0,0,0,0.08)",
              transform: "translateZ(10px)"
            }}
          >
            <div style={{ borderRadius: 15, overflow: "hidden", background: "#ffffff", border: "1px solid rgba(0, 0, 0, 0.05)" }}>

              {/* macOS Window Title Bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,0.05)", background: "#fafafc" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f56" }} />
                  <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ffbd2e" }} />
                  <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#27c93f" }} />
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "#8e8ea8", fontFamily: "monospace", letterSpacing: "0.05em" }}>scoutai.dev/app/dashboard</span>
                </div>
                <div style={{ width: 45 }} />
              </div>

              {/* Mock Dashboard Layout */}
              <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1.2fr 2fr 1.5fr", gap: 20, background: "#ffffff" }} className="flex-col md:grid">

                {/* Panel 1: Profile Summary */}
                <div className="glass-card" style={{ padding: 20, background: "rgba(250,250,252,0.6)", display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #000000, #555555)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontWeight: 700, fontSize: "0.875rem" }}>
                      JD
                    </div>
                    <div>
                      <h4 style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#000" }}>Alex Mercer</h4>
                      <p style={{ fontSize: "0.6875rem", color: "#5a5a6b" }}>Software Engineer</p>
                    </div>
                  </div>

                  <div style={{ height: 1, background: "rgba(0,0,0,0.05)" }} />

                  {/* ATS Ring Dial */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0" }}>
                    <div style={{ position: "relative", width: 90, height: 90 }}>
                      <svg style={{ width: 90, height: 90, transform: "rotate(-90deg)" }} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="44" stroke="rgba(0, 0, 0, 0.04)" strokeWidth="8" fill="none" />
                        <circle cx="50" cy="50" r="44" stroke="#000000" strokeWidth="8" fill="none" strokeDasharray="276" strokeDashoffset="28" strokeLinecap="round" />
                      </svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#000" }}>90%</span>
                        <span style={{ fontSize: "0.5rem", color: "#8e8ea8", fontWeight: 600, letterSpacing: "0.05em" }}>MATCH</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Tag List */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <span style={{ padding: "4px 8px", background: "#000000", color: "#ffffff", borderRadius: 6, fontSize: "0.625rem", fontWeight: 600 }}>TypeScript</span>
                    <span style={{ padding: "4px 8px", background: "rgba(0,0,0,0.04)", color: "#555555", borderRadius: 6, fontSize: "0.625rem", fontWeight: 600 }}>Python</span>
                    <span style={{ padding: "4px 8px", background: "rgba(0,0,0,0.04)", color: "#555555", borderRadius: 6, fontSize: "0.625rem", fontWeight: 600 }}>React</span>
                  </div>
                </div>

                {/* Panel 2: Internship Matcher List */}
                <div className="glass-card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "0.875rem", fontWeight: 700 }}>Top Internships Match</h3>
                    <span style={{ fontSize: "0.6875rem", color: "#5a5a6b" }}>2 Matches Found</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* Item 1 */}
                    <div style={{ padding: 12, borderRadius: 10, background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.03)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <div>
                          <h4 style={{ fontSize: "0.75rem", fontWeight: 700 }}>Frontend Engineer Intern</h4>
                          <p style={{ fontSize: "0.625rem", color: "#8e8ea8" }}>Vercel • Remote</p>
                        </div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#22c55e" }}>94%</span>
                      </div>
                      <div style={{ height: 4, background: "rgba(0,0,0,0.04)", borderRadius: 9999, overflow: "hidden" }}>
                        <div style={{ height: "100%", background: "#000000", width: "94%" }} />
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div style={{ padding: 12, borderRadius: 10, background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.03)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <div>
                          <h4 style={{ fontSize: "0.75rem", fontWeight: 700 }}>Full-Stack Developer Intern</h4>
                          <p style={{ fontSize: "0.625rem", color: "#8e8ea8" }}>Stripe • SF / Hybrid</p>
                        </div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#22c55e" }}>87%</span>
                      </div>
                      <div style={{ height: 4, background: "rgba(0,0,0,0.04)", borderRadius: 9999, overflow: "hidden" }}>
                        <div style={{ height: "100%", background: "#555555", width: "87%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panel 3: AI Career Coach Quick Panel */}
                <div className="glass-card" style={{ padding: 20, background: "rgba(250,250,252,0.6)", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Cpu size={16} style={{ color: "#000" }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>Coach Assistant</span>
                  </div>

                  <div style={{ height: 1, background: "rgba(0,0,0,0.05)" }} />

                  {/* Chat bubble */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.06)", padding: 10, borderRadius: 10, fontSize: "0.6875rem", color: "#5a5a6b", lineHeight: 1.45, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                      "You have solid **TypeScript** foundations. Let's rewrite your internship summaries to focus on performance metrics."
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <span style={{ fontSize: "0.55rem", color: "#8e8ea8" }}>AI Coach Suggestion</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, marginTop: "auto", fontSize: "0.6875rem", color: "#8e8ea8" }}>
                    <MessageSquare size={12} />
                    <span>Type message...</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Underlay shadow */}
          <div style={{ position: "absolute", inset: -20, background: "rgba(0, 0, 0, 0.015)", borderRadius: 30, filter: "blur(30px)", zIndex: -1 }} />
        </div>



      </div>
    </section>
  );
}
