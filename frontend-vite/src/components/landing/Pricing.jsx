import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const plans = [
  { name: "Free", price: "$0", period: "forever", description: "Perfect for getting started", features: ["3 resume analyses/month", "5 job matches/month", "Basic skill gap report", "Community support"], cta: "Get Started", highlighted: false },
  { name: "Pro", price: "$12", period: "/month", description: "For serious job seekers", features: ["Unlimited resume analyses", "Unlimited job matches", "AI Resume Fixer", "GitHub Analyzer", "Skill Gap Roadmap", "AI Career Coach", "Priority support"], cta: "Upgrade to Pro", highlighted: true },
  { name: "Team", price: "$29", period: "/month", description: "For colleges & career centers", features: ["Everything in Pro", "Up to 50 students", "Admin dashboard", "Batch analysis", "Custom branding", "Dedicated support"], cta: "Contact Sales", highlighted: false },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, idx: null });

  const handleMouseMove = (e, idx) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = -((e.clientY - rect.top - rect.height / 2) / rect.height) * 12;
    const y = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 12;
    setTilt({ x, y, idx });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, idx: null });
  };

  return (
    <section id="pricing" style={{ position: "relative", padding: "128px 0", overflow: "hidden", scrollMarginTop: 80 }}>
      <div className="glow-orb" style={{ width: 500, height: 500, background: "rgba(0, 0, 0, 0.03)", top: "30%", left: -200, position: "absolute" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontSize: "0.875rem", color: "#777777", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>Pricing</span>
          <h2 style={{ fontSize: "clamp(1.875rem, 5vw, 3rem)", fontWeight: 700, marginTop: 12, marginBottom: 20 }}>
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p style={{ fontSize: "1.125rem", color: "#5a5a6b", maxWidth: 560, margin: "0 auto" }}>Start free. Upgrade when you&apos;re ready to go all-in.</p>

          {/* Toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 32 }}>
            <span style={{ fontSize: "0.875rem", color: annual ? "#8e8ea8" : "#000000" }}>Monthly</span>
            <button onClick={() => setAnnual(!annual)} style={{ position: "relative", width: 48, height: 24, borderRadius: 9999, background: "rgba(0, 0, 0, 0.1)", border: "none", cursor: "pointer", transition: "all 0.3s" }}>
              <div style={{ position: "absolute", top: 2, width: 20, height: 20, borderRadius: "50%", background: "#000000", transition: "all 0.3s", left: annual ? 26 : 2 }} />
            </button>
            <span style={{ fontSize: "0.875rem", color: annual ? "#000000" : "#8e8ea8" }}>Annual <span style={{ color: "#2e2e2e", fontSize: "0.75rem" }}>(-20%)</span></span>
          </div>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24, alignItems: "stretch" }}>
          {plans.map((plan, index) => {
            const isHovered = tilt.idx === index;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={handleMouseLeave}
                className="glass-card"
                style={{
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  transform: isHovered
                    ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(8px)`
                    : "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
                  transition: "transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease, border-color 0.3s ease",
                  transformStyle: "preserve-3d",
                  borderColor: plan.highlighted
                    ? (isHovered ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.2)")
                    : (isHovered ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.08)"),
                  boxShadow: isHovered
                    ? "0 25px 50px rgba(0, 0, 0, 0.08)"
                    : (plan.highlighted ? "0 8px 30px rgba(0, 0, 0, 0.03)" : "0 4px 12px rgba(0, 0, 0, 0.01)"),
                }}
              >
                {plan.highlighted && (
                  <div style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%) translateZ(30px)",
                    padding: "4px 16px",
                    borderRadius: 9999,
                    background: "#000000",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#ffffff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}>
                    Most Popular
                  </div>
                )}

                <div style={{ marginBottom: 24, transform: "translateZ(20px)" }}>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#000000" }}>{plan.name}</h3>
                  <p style={{ fontSize: "0.875rem", color: "#8e8ea8", marginTop: 4 }}>{plan.description}</p>
                </div>

                <div style={{ marginBottom: 24, transform: "translateZ(30px)" }}>
                  <span className="gradient-text" style={{ fontSize: "2.25rem", fontWeight: 700 }}>
                    {plan.price === "$0" ? "$0" : annual ? `$${Math.round(parseInt(plan.price.slice(1)) * 0.8)}` : plan.price}
                  </span>
                  <span style={{ color: "#8e8ea8", fontSize: "0.875rem", marginLeft: 4 }}>{plan.period}</span>
                </div>

                <ul style={{ listStyle: "none", padding: 0, flex: 1, display: "flex", flexDirection: "column", gap: 12, marginBottom: 32, transform: "translateZ(15px)" }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.875rem", color: "#373747" }}>
                      <svg style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0, color: "#2e2e2e" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <div style={{ transform: "translateZ(25px)" }}>
                  <Link to="/signup" className={plan.highlighted ? "btn-primary" : "btn-secondary"} style={{ display: "block", textAlign: "center", padding: "12px", borderRadius: 12, fontWeight: 600, fontSize: "0.875rem", width: "100%" }}>
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
