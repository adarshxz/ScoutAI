import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { step: "01", title: "Upload Your Resume", description: "Upload your PDF or DOCX resume. Our AI extracts and analyzes every detail automatically.", badge: "ATS Engine", color: "linear-gradient(135deg, #000000, #333333)" },
  { step: "02", title: "Paste Job Description", description: "Paste any internship or job description. AI extracts required skills, frameworks, and experience.", badge: "Semantic Parser", color: "linear-gradient(135deg, #2e2e2e, #666666)" },
  { step: "03", title: "AI Analyzes & Matches", description: "Our engine semantically compares your profile — skills, projects, GitHub — against the role.", badge: "Neural Matcher", color: "linear-gradient(135deg, #1c1c1c, #555555)" },
  { step: "04", title: "Get Actionable Insights", description: "Receive match scores, skill gaps, resume fixes, and a personalized roadmap to improve.", badge: "Action Blueprint", color: "linear-gradient(135deg, #000000, #444444)" },
];

export default function HowItWorks() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef(null);

  // Smooth continuous auto-sliding effect
  useEffect(() => {
    const intervalTime = isHolding ? 2500 : 4000;
    
    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % steps.length);
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHolding]);

  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = -((e.clientY - rect.top - rect.height / 2) / rect.height) * 12;
    const y = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 12;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    card.style.setProperty("--tilt-x", `${x}deg`);
    card.style.setProperty("--tilt-y", `${y}deg`);
    card.style.setProperty("--mouse-x", `${mouseX}px`);
    card.style.setProperty("--mouse-y", `${mouseY}px`);
    card.style.setProperty("--shadow-y", "35px");
    card.style.setProperty("--shadow-blur", "80px");
    card.style.setProperty("--shadow-opacity", "0.12");
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--mouse-x", "50%");
    card.style.setProperty("--mouse-y", "50%");
    card.style.setProperty("--shadow-y", "20px");
    card.style.setProperty("--shadow-blur", "50px");
    card.style.setProperty("--shadow-opacity", "0.06");
    setIsHolding(false);
  };

  // Helper to determine index of prev and next cards for peeking
  const getPrevIdx = () => (activeIdx - 1 + steps.length) % steps.length;
  const getNextIdx = () => (activeIdx + 1) % steps.length;

  return (
    <section id="how-it-works" style={{ position: "relative", padding: "80px 0", overflow: "hidden", background: "#fcfcfc", scrollMarginTop: 80 }}>
      <div className="glow-orb" style={{ width: 500, height: 500, background: "rgba(0, 0, 0, 0.02)", bottom: -100, left: -100, position: "absolute" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          <span style={{
            display: "inline-block",
            fontSize: "0.75rem",
            color: "#555555",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "6px 16px",
            borderRadius: 9999,
            border: "1px solid rgba(0,0,0,0.08)",
            background: "rgba(0,0,0,0.02)",
            marginBottom: 16
          }}>
            How It Works
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 800, marginTop: 12, marginBottom: 20, letterSpacing: "-0.02em" }}>
            <span className="gradient-text-shine">Four Simple Steps</span> to Your Perfect Match
          </h2>
          <p style={{ fontSize: "1.125rem", color: "#5a5a6b", maxWidth: 640, margin: "0 auto" }}>
            Watch the AI engine process and match your profile in real-time.
          </p>
        </motion.div>

        {/* Breathtaking 3D Horizontal Card Slider Showcase */}
        <div style={{ position: "relative", height: "340px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>

          <div style={{ position: "relative", width: "100%", maxWidth: "800px", height: "330px", display: "flex", alignItems: "center", justifyContent: "center" }}>

            <AnimatePresence initial={false} mode="popLayout">
              {/* LEFT CARD (PEEKING PREVIOUS) */}
              <motion.div
                key={`prev-${getPrevIdx()}`}
                initial={{ opacity: 0, scale: 0.75, x: -280, rotateY: 35, zIndex: 1 }}
                animate={{ opacity: 0.4, scale: 0.82, x: -240, rotateY: 25, zIndex: 5 }}
                exit={{ opacity: 0, scale: 0.7, x: -340, rotateY: 45 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setActiveIdx(getPrevIdx())}
                style={{
                  position: "absolute",
                  width: "360px",
                  height: "280px",
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                <div
                  className="glass-card"
                  style={{
                    padding: "32px",
                    background: "rgba(255, 255, 255, 0.4)",
                    border: "1px solid rgba(0, 0, 0, 0.04)",
                    borderRadius: "20px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    pointerEvents: "none"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem" }}>
                      {steps[getPrevIdx()].step}
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "rgba(0,0,0,0.6)" }}>{steps[getPrevIdx()].title}</h3>
                    <p style={{ fontSize: "0.8rem", color: "rgba(90,90,107,0.6)", marginTop: "8px", lineHeight: 1.5 }}>{steps[getPrevIdx()].description}</p>
                  </div>
                </div>
              </motion.div>

              {/* CENTER CARD (ACTIVE FOCUS IN 3D PERSPECTIVE) */}
              <motion.div
                key={`active-${activeIdx}`}
                initial={{ opacity: 0, scale: 0.9, x: 0, rotateY: 0, zIndex: 10 }}
                animate={{ opacity: 1, scale: 1.02, x: 0, rotateY: 0, zIndex: 10 }}
                exit={{ opacity: 0, scale: 0.9, x: 0, rotateY: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                onMouseMove={handleCardMouseMove}
                onMouseDown={() => setIsHolding(true)}
                onMouseUp={() => setIsHolding(false)}
                onMouseEnter={() => setIsHolding(true)}
                onMouseLeave={handleCardMouseLeave}
                onClick={() => setActiveIdx(getNextIdx())}
                style={{
                  position: "absolute",
                  width: "440px",
                  height: "320px",
                  cursor: "pointer",
                  perspective: 1000,
                  transformStyle: "preserve-3d",
                  zIndex: 20
                }}
              >
                <div
                  className="glass-card"
                  style={{
                    padding: "40px",
                    background: isHolding ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.8)",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    borderRadius: "24px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transformStyle: "preserve-3d",
                    transform: "rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateZ(10px)",
                    boxShadow: "0 var(--shadow-y, 20px) var(--shadow-blur, 50px) rgba(0,0,0,var(--shadow-opacity, 0.06)), 0 0 0 1px rgba(0,0,0,0.02)",
                    transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease, background 0.3s ease",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  {/* Spotlight shine tracker overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      background: "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,0,0,0.035) 0%, transparent 80%)",
                      zIndex: 0
                    }}
                  />

                  {/* Top layout */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 2, transform: "translateZ(30px)" }}>
                    <div style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: steps[activeIdx].color,
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                    }}>
                      {steps[activeIdx].step}
                    </div>
                    <div style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: isHolding ? "#000000" : "#8e8ea8",
                      background: "rgba(0,0,0,0.04)",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase"
                    }}>
                      {steps[activeIdx].badge}
                    </div>
                  </div>

                  {/* Body Text */}
                  <div style={{ zIndex: 2, transform: "translateZ(20px)" }}>
                    <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#000000" }}>{steps[activeIdx].title}</h3>
                    <p style={{ fontSize: "0.9rem", color: "#5a5a6b", marginTop: "12px", lineHeight: 1.6 }}>{steps[activeIdx].description}</p>
                  </div>

                  {/* Active holding progress line */}
                  <div style={{ width: "100%", height: "3px", background: "rgba(0,0,0,0.05)", borderRadius: "2px", overflow: "hidden", zIndex: 2, transform: "translateZ(15px)" }}>
                    <motion.div
                      key={activeIdx}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: isHolding ? 2.5 : 4, ease: "linear" }}
                      style={{ height: "100%", background: "#000000" }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* RIGHT CARD (PEEKING NEXT) */}
              <motion.div
                key={`next-${getNextIdx()}`}
                initial={{ opacity: 0, scale: 0.75, x: 280, rotateY: -35, zIndex: 1 }}
                animate={{ opacity: 0.4, scale: 0.82, x: 240, rotateY: -25, zIndex: 5 }}
                exit={{ opacity: 0, scale: 0.7, x: 340, rotateY: -45 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setActiveIdx(getNextIdx())}
                style={{
                  position: "absolute",
                  width: "360px",
                  height: "280px",
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                <div
                  className="glass-card"
                  style={{
                    padding: "32px",
                    background: "rgba(255, 255, 255, 0.4)",
                    border: "1px solid rgba(0, 0, 0, 0.04)",
                    borderRadius: "20px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    pointerEvents: "none"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem" }}>
                      {steps[getNextIdx()].step}
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "rgba(0,0,0,0.6)" }}>{steps[getNextIdx()].title}</h3>
                    <p style={{ fontSize: "0.8rem", color: "rgba(90,90,107,0.6)", marginTop: "8px", lineHeight: 1.5 }}>{steps[getNextIdx()].description}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>
        </div>

        {/* Carousel Pagination Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", marginTop: "24px" }}>
          <button
            onClick={() => setActiveIdx(getPrevIdx())}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#000000"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>

          <div style={{ display: "flex", gap: "8px" }}>
            {steps.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setActiveIdx(dotIdx)}
                style={{
                  width: activeIdx === dotIdx ? "28px" : "8px",
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

          <button
            onClick={() => setActiveIdx(getNextIdx())}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#000000"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>

      </div>
    </section>
  );
}
