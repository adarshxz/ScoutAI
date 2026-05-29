import { useState } from "react";
import { motion } from "framer-motion";

const testimonials = [
  { name: "Priya Sharma", role: "SDE Intern @ Google", quote: "ScoutAI helped me identify exactly what skills I was missing. My match score went from 62% to 91% in two weeks!", avatar: "PS" },
  { name: "Arjun Patel", role: "ML Intern @ Microsoft", quote: "The AI resume fixer rewrote my bullet points and my callback rate tripled. This tool is a game-changer.", avatar: "AP" },
  { name: "Sara Chen", role: "Frontend Intern @ Stripe", quote: "Unlike other ATS tools, ScoutAI actually understood my hackathon projects. It matched me based on real skills.", avatar: "SC" },
];

export default function Testimonials() {
  const [tilt, setTilt] = useState({ x: 0, y: 0, idx: null });

  const handleCardMouseMove = (e, idx) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = -((e.clientY - rect.top - rect.height / 2) / rect.height) * 10;
    const y = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 10;
    setTilt({ x, y, idx });
  };

  const handleCardMouseLeave = () => {
    setTilt({ x: 0, y: 0, idx: null });
  };

  return (
    <section style={{ position: "relative", padding: "128px 0", overflow: "hidden" }}>
      <div style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64 }}>
          <span style={{ display: "inline-block", fontSize: "0.75rem", color: "#555555", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 16px", borderRadius: 9999, border: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)", marginBottom: 16 }}>Testimonials</span>
          <h2 style={{ fontSize: "clamp(1.875rem, 5vw, 3rem)", fontWeight: 700, marginTop: 12, marginBottom: 20 }}>
            Loved by <span className="gradient-text">Students Worldwide</span>
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseMove={(e) => handleCardMouseMove(e, index)}
              onMouseLeave={handleCardMouseLeave}
            >
              <div
                className="glass-card"
                style={{
                  padding: 32,
                  transform: tilt.idx === index
                    ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(8px)`
                    : "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
                  transition: "transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease",
                  transformStyle: "preserve-3d",
                  boxShadow: tilt.idx === index
                    ? "0 20px 50px rgba(0,0,0,0.08)"
                    : "0 4px 12px rgba(0,0,0,0.02)",
                }}
              >
                {/* Stars */}
                <div style={{ display: "flex", gap: 4, marginBottom: 16, transform: "translateZ(25px)" }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p style={{ color: "#373747", fontSize: "0.875rem", lineHeight: 1.625, marginBottom: 24, fontStyle: "italic", transform: "translateZ(15px)" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, transform: "translateZ(20px)" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #000000, #555555)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "0.875rem", fontWeight: 700, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#000000" }}>{t.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#8e8ea8" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
