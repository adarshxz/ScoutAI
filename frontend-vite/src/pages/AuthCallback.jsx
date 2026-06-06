import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const hasAuthParams =
      window.location.hash.includes("access_token") ||
      window.location.hash.includes("id_token") ||
      window.location.search.includes("code=") ||
      window.location.search.includes("error=");

    if (!hasAuthParams) {
      navigate("/login");
      return;
    }

    const goToDashboard = () => {
      if (!cancelled) {
        cancelled = true;
        navigate("/dashboard");
      }
    };

    // 1. Listen for ANY auth state change that carries a session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        goToDashboard();
      }
    });

    // 2. Poll getSession quickly — the code exchange is async and may resolve
    //    between the initial check and the onAuthStateChange callback
    const poll = async () => {
      for (let i = 0; i < 10; i++) {
        if (cancelled) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          goToDashboard();
          return;
        }
        await new Promise(r => setTimeout(r, 300)); // 300ms intervals
      }
      // If still no session after ~3s of polling, redirect to login
      if (!cancelled) {
        cancelled = true;
        navigate("/login?error=auth-timeout");
      }
    };
    poll();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafafc" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{
          width: 36,
          height: 36,
          border: "3px solid rgba(0, 0, 0, 0.08)",
          borderTopColor: "#000000",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <p style={{ fontSize: "0.875rem", color: "#5a5a6b", fontWeight: 500 }}>Completing authentication...</p>
      </div>
    </div>
  );
}

