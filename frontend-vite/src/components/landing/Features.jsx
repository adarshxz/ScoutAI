import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const features = [
  {
    id: 0,
    icon: "📄",
    title: "AI Resume Analyzer",
    tagline: "ATS EVALUATION",
    description: "Get instant ATS scores, grammar checks, and AI-powered suggestions to make your resume stand out to top recruiters.",
    gradient: "linear-gradient(135deg, #000000 0%, #333333 100%)",
    badge: "Score: 89%"
  },
  {
    id: 1,
    icon: "🔍",
    title: "Smart Job Matching",
    tagline: "SEMANTIC PIPELINE",
    description: "Semantic AI matching goes beyond keywords — understanding your projects, skills, and experience to locate optimal roles.",
    gradient: "linear-gradient(135deg, #2e2e2e 0%, #555555 100%)",
    badge: "95% Match"
  },
  {
    id: 2,
    icon: "✏️",
    title: "Resume Fixer AI",
    tagline: "COACHING REWRITE",
    description: "One-click AI rewrites for weak bullet points. Transform descriptions into high-impact metrics-driven achievements.",
    gradient: "linear-gradient(135deg, #1c1c1c 0%, #444444 100%)",
    badge: "ATS Approved"
  },
  {
    id: 3,
    icon: "🐙",
    title: "GitHub Analyzer",
    tagline: "PORTFOLIO METRICS",
    description: "Analyze your GitHub profile — repositories, commits, language breakdown, and coding consistency in 10 seconds.",
    gradient: "linear-gradient(135deg, #000000 0%, #555555 100%)",
    badge: "342 Commits"
  },
  {
    id: 4,
    icon: "📚",
    title: "Skill Gap Analysis",
    tagline: "ROADMAP CURATOR",
    description: "Discover missing skills with estimated impact scores and an automatically curated personalized learning roadmap.",
    gradient: "linear-gradient(135deg, #333333 0%, #666666 100%)",
    badge: "GraphQL Needed"
  },
  {
    id: 5,
    icon: "💬",
    title: "AI Career Coach",
    tagline: "INTERACTIVE MENTOR",
    description: "Chat with an AI coach for career guidance, interview preparation, mock questions, and customized project pathways.",
    gradient: "linear-gradient(135deg, #222222 0%, #777777 100%)",
    badge: "Google Coach"
  },
];

export default function Features() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef(null);
  const cardRef = useRef(null);

  // Auto-progress through features (6 seconds duration)
  useEffect(() => {
    if (isHolding) return;
    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % features.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHolding]);

  const handleConsoleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = -((e.clientY - rect.top - rect.height / 2) / rect.height) * 12;
    const y = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 12;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (cardRef.current) {
      cardRef.current.style.setProperty('--tilt-x', `${x}deg`);
      cardRef.current.style.setProperty('--tilt-y', `${y}deg`);
      cardRef.current.style.setProperty('--mouse-x', `${mouseX}px`);
      cardRef.current.style.setProperty('--mouse-y', `${mouseY}px`);
    }
  };

  const handleConsoleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.setProperty('--tilt-x', '0deg');
      cardRef.current.style.setProperty('--tilt-y', '0deg');
      cardRef.current.style.setProperty('--mouse-x', '0px');
      cardRef.current.style.setProperty('--mouse-y', '0px');
    }
    setIsHolding(false);
  };

  // Custom 3D preview widgets matching the active feature
  const renderWidget = (index) => {
    switch (index) {
      case 0:
        return (
          <div style={{ position: "relative", width: "100%", height: "200px", display: "flex", alignItems: "center", justifyContent: "center", transformStyle: "preserve-3d" }}>
            <div style={{ width: "200px", background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "16px", padding: "20px", boxShadow: "0 15px 35px rgba(0,0,0,0.05)", transform: "translateZ(30px) rotateY(-5deg)", transformStyle: "preserve-3d" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#000000" }}>Priya_Resume.pdf</span>
                <span style={{ fontSize: "0.6rem", fontWeight: 700, background: "rgba(34, 197, 94, 0.12)", color: "#22c55e", padding: "2px 6px", borderRadius: "99px" }}>Passed</span>
              </div>
              <div style={{ width: "100%", height: "4px", background: "rgba(0,0,0,0.05)", borderRadius: "2px", marginBottom: "8px" }} />
              <div style={{ width: "85%", height: "4px", background: "rgba(0,0,0,0.05)", borderRadius: "2px", marginBottom: "8px" }} />

              <div style={{ display: "flex", gap: "8px", marginTop: "16px", transform: "translateZ(20px)" }}>
                <div style={{ flex: 1, padding: "6px", borderRadius: "8px", background: "rgba(0,0,0,0.02)", textAlign: "center", border: "1px solid rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: "0.55rem", color: "#8e8ea8", fontWeight: 600 }}>ATS SCORE</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 900, color: "#000000" }}>89%</div>
                </div>
                <div style={{ flex: 1, padding: "6px", borderRadius: "8px", background: "rgba(0,0,0,0.02)", textAlign: "center", border: "1px solid rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: "0.55rem", color: "#8e8ea8", fontWeight: 600 }}>ERRORS</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 900, color: "#22c55e" }}>0</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div style={{ position: "relative", width: "100%", height: "200px", display: "flex", alignItems: "center", justifyContent: "center", transformStyle: "preserve-3d" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", transformStyle: "preserve-3d" }}>
              <div style={{ padding: "10px 14px", background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "10px", boxShadow: "0 8px 20px rgba(0,0,0,0.03)", transform: "translateZ(30px)" }}>
                <div style={{ fontSize: "0.6rem", color: "#8e8ea8", fontWeight: 600 }}>SKILLS</div>
                <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#000000" }}>React, Python</div>
              </div>
              <div style={{ width: "30px", height: "2px", background: "rgba(0,0,0,0.1)", position: "relative" }}>
                <motion.div
                  animate={{ left: ["0%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  style={{ position: "absolute", top: "-3px", width: "8px", height: "8px", borderRadius: "50%", background: "#000000" }}
                />
              </div>
              <div style={{ padding: "10px 14px", background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "10px", boxShadow: "0 8px 20px rgba(0,0,0,0.03)", transform: "translateZ(30px)" }}>
                <div style={{ fontSize: "0.6rem", color: "#8e8ea8", fontWeight: 600 }}>ROLE MATCH</div>
                <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#000000" }}>SDE Intern</div>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: "20px", padding: "4px 12px", borderRadius: "20px", background: "#000000", color: "#ffffff", fontSize: "0.7rem", fontWeight: 700, transform: "translateZ(50px)" }}>
              ⚡ 95% Compatibility
            </div>
          </div>
        );
      case 2:
        return (
          <div style={{ position: "relative", width: "100%", height: "200px", display: "flex", alignItems: "center", justifyContent: "center", transformStyle: "preserve-3d" }}>
            <div style={{ width: "240px", display: "flex", flexDirection: "column", gap: "8px", transformStyle: "preserve-3d" }}>
              <div style={{ padding: "10px 14px", background: "rgba(0, 0, 0, 0.02)", border: "1px dashed rgba(0,0,0,0.1)", borderRadius: "8px", transform: "translateZ(10px)" }}>
                <span style={{ fontSize: "0.55rem", fontWeight: 700, color: "#8e8ea8", display: "block" }}>BEFORE</span>
                <p style={{ fontSize: "0.68rem", color: "#555555", margin: 0 }}>"I coded APIs in Django."</p>
              </div>
              <div style={{ padding: "10px 14px", background: "#ffffff", border: "1px solid rgba(0, 0, 0, 0.1)", borderRadius: "8px", transform: "translateZ(35px)", boxShadow: "0 8px 20px rgba(0,0,0,0.04)" }}>
                <span style={{ fontSize: "0.55rem", fontWeight: 700, color: "#000000", display: "block" }}>REWRITTEN ACTIVE VERBS</span>
                <p style={{ fontSize: "0.68rem", color: "#000000", fontWeight: 700, margin: 0 }}>"Architected highly scalable RESTful APIs in Go/Django, lowering latency by 32%."</p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div style={{ position: "relative", width: "100%", height: "200px", display: "flex", alignItems: "center", justifyContent: "center", transformStyle: "preserve-3d" }}>
            <div style={{ width: "220px", background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "12px", padding: "14px", boxShadow: "0 10px 25px rgba(0,0,0,0.04)", transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#000000", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem" }}>🐙</div>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#000000" }}>priya-sharma/github</div>
              </div>

              <div style={{ display: "flex", gap: "2px", width: "100%", marginBottom: "8px" }}>
                {[...Array(24)].map((_, i) => {
                  const green = i % 3 === 0 ? "rgba(0,0,0,0.8)" : i % 2 === 0 ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.05)";
                  return <div key={i} style={{ width: "10px", height: "10px", borderRadius: "2px", background: green }} />;
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.55rem", fontWeight: 750, color: "#000000", borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: "6px" }}>
                <span>JS/TS: 62%</span>
                <span>Go: 24%</span>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div style={{ position: "relative", width: "100%", height: "200px", display: "flex", alignItems: "center", justifyContent: "center", transformStyle: "preserve-3d" }}>
            <div style={{ width: "200px", display: "flex", flexDirection: "column", gap: "6px", transformStyle: "preserve-3d" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 10px", background: "#ffffff", border: "1px solid rgba(0,0,0,0.05)", borderRadius: "6px", transform: "translateZ(10px)" }}>
                <span style={{ color: "#22c55e", fontSize: "0.7rem" }}>✓</span>
                <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "#000000" }}>React (Core)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 10px", background: "rgba(239,68,68,0.02)", border: "1px dashed rgba(239,68,68,0.2)", borderRadius: "6px", transform: "translateZ(35px)" }}>
                <span style={{ color: "#ef4444", fontSize: "0.7rem" }}>⚠</span>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#000000" }}>GraphQL (Missing)</span>
                <span style={{ fontSize: "0.55rem", background: "#000000", color: "#ffffff", padding: "1px 4px", borderRadius: "3px", marginLeft: "auto", fontWeight: 700 }}>+12%</span>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div style={{ position: "relative", width: "100%", height: "200px", display: "flex", alignItems: "center", justifyContent: "center", transformStyle: "preserve-3d" }}>
            <div style={{ width: "220px", display: "flex", flexDirection: "column", gap: "8px", transformStyle: "preserve-3d" }}>
              <div style={{ width: "85%", alignSelf: "flex-start", padding: "8px 12px", background: "#000000", color: "#ffffff", borderBottomLeftRadius: "2px", borderBottomRightRadius: "10px", borderTopLeftRadius: "10px", borderTopRightRadius: "10px", fontSize: "0.68rem", transform: "translateZ(15px)" }}>
                "Google interview prep loaded. Caching strategy question..."
              </div>
              <div style={{ width: "80%", alignSelf: "flex-end", padding: "8px 12px", background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", color: "#000000", borderBottomLeftRadius: "10px", borderBottomRightRadius: "2px", borderTopLeftRadius: "10px", borderTopRightRadius: "10px", fontSize: "0.68rem", transform: "translateZ(35px)", boxShadow: "0 6px 15px rgba(0,0,0,0.02)" }}>
                "I want to review Redis write-through policies."
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getNextIdx = () => (activeIdx + 1) % features.length;
  const getPrevIdx = () => (activeIdx - 1 + features.length) % features.length;

  return (
    <section id="features" style={{ position: "relative", paddingTop: 40, paddingBottom: 140, overflow: "hidden", background: "#ffffff", scrollMarginTop: 80 }}>
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.35, pointerEvents: "none" }} />
      <div className="glow-orb" style={{ width: 500, height: 500, background: "rgba(0, 0, 0, 0.02)", top: "10%", right: -150, position: "absolute" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: 72 }}
        >
          <span style={{
            display: "inline-block",
            fontSize: "0.75rem",
            color: "#000000",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "8px 20px",
            borderRadius: 9999,
            border: "1px solid rgba(0,0,0,0.08)",
            background: "rgba(0,0,0,0.02)",
            marginBottom: 20
          }}>
            Features
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 800, marginTop: 12, marginBottom: 20, letterSpacing: "-0.02em", color: "#000000" }}>
            Everything You Need to <span className="gradient-text-shine" style={{ fontWeight: 900 }}>Land Your Dream Internship</span>
          </h2>
          <p style={{ fontSize: "1.125rem", color: "#5a5a6b", maxWidth: 640, margin: "0 auto" }}>
            A complete AI-powered toolkit designed specifically for students who build, learn, and contribute.
          </p>
        </motion.div>

        {/* SHOWCASE CONTAINER */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", position: "relative" }}>

          {/* Feature Tabs Navigation */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "32px",
            width: "100%",
            maxWidth: "780px",
            zIndex: 10
          }}>
            {features.map((item, index) => {
              const isActive = activeIdx === index;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveIdx(index)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    borderRadius: "9999px",
                    background: isActive ? "#000000" : "rgba(0, 0, 0, 0.03)",
                    border: "1px solid",
                    borderColor: isActive ? "#000000" : "rgba(0, 0, 0, 0.06)",
                    color: isActive ? "#ffffff" : "#5a5a6b",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.08)" : "none"
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* ACTIVE CENTRAL CARD CORE (Taps to advance) */}
          <div
            onMouseMove={handleConsoleMouseMove}
            onMouseEnter={() => setIsHolding(true)}
            onMouseLeave={handleConsoleMouseLeave}
            onClick={() => setActiveIdx(getNextIdx())}
            style={{
              perspective: 1200,
              transformStyle: "preserve-3d",
              width: "100%",
              maxWidth: "780px",
              cursor: "pointer"
            }}
          >
            <div
              ref={cardRef}
              className="glass-card"
              style={{
                position: "relative",
                width: "100%",
                background: "rgba(255, 255, 255, 0.8)",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                borderRadius: "24px",
                padding: "36px 32px",
                transformStyle: "preserve-3d",
                transform: "rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateZ(10px)",
                boxShadow: isHolding
                  ? "0 35px 80px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)"
                  : "0 15px 35px rgba(0,0,0,0.02), 0 0 0 1px rgba(0,0,0,0.01)",
                transition: "transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease",
                minHeight: "360px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflow: "hidden",
                "--tilt-x": "0deg",
                "--tilt-y": "0deg",
                "--mouse-x": "0px",
                "--mouse-y": "0px"
              }}
            >
              {/* Highlight spotlight shine */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  background: "radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(0,0,0,0.035) 0%, transparent 80%)",
                  zIndex: 0
                }}
              />

              {/* Sub-header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "14px", zIndex: 2, transform: "translateZ(30px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} />
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#6b6b7b", letterSpacing: "0.05em", textTransform: "uppercase" }}>NEURAL MODULE</span>
                </div>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#ffffff", background: "#000000", padding: "3px 10px", borderRadius: "6px" }}>
                  {features[activeIdx].tagline}
                </div>
              </div>

              {/* Live Preview Showcase */}
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", margin: "20px 0", zIndex: 1 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIdx}
                    initial={{ opacity: 0, scale: 0.92, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -10 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    style={{ width: "100%", display: "flex", justifyContent: "center", transformStyle: "preserve-3d" }}
                  >
                    {renderWidget(activeIdx)}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Description & Linear Slide Progress bar */}
              <div style={{ zIndex: 2, transform: "translateZ(35px)" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#000000", marginBottom: "8px" }}>
                  {features[activeIdx].title}
                </h3>
                <p style={{ color: "#5a5a6b", fontSize: "0.85rem", lineHeight: "1.6", marginBottom: "16px" }}>
                  {features[activeIdx].description}
                </p>

                {/* Visual loading loader */}
                <div style={{ width: "100%", height: "2.5px", background: "rgba(0,0,0,0.05)", borderRadius: "2px", overflow: "hidden" }}>
                  <motion.div
                    key={activeIdx}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6, ease: "linear" }}
                    style={{ height: "100%", background: "#000000" }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Core Dots selector navigation */}
          <div style={{ display: "flex", gap: "8px", marginTop: "24px" }}>
            {features.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setActiveIdx(dotIdx)}
                style={{
                  width: activeIdx === dotIdx ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "99px",
                  background: activeIdx === dotIdx ? "#000000" : "rgba(0,0,0,0.12)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.35s ease"
                }}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
