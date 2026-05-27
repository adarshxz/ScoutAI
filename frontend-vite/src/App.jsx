import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ScrollToTop from "./components/ScrollToTop";
import Landing from "./pages/Landing";

// Lazy-loaded routes — only downloaded when the user navigates to them
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const DashboardLayout = lazy(() => import("./components/dashboard/DashboardLayout"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Profile = lazy(() => import("./pages/dashboard/Profile"));
const Projects = lazy(() => import("./pages/dashboard/Projects"));
const Resume = lazy(() => import("./pages/dashboard/Resume"));
const Job = lazy(() => import("./pages/dashboard/Job"));
const History = lazy(() => import("./pages/dashboard/History"));
const Coach = lazy(() => import("./pages/dashboard/Coach"));
const GithubAnalyzer = lazy(() => import("./pages/dashboard/GithubAnalyzer"));
const Documentation = lazy(() => import("./pages/Documentation"));
const Blog = lazy(() => import("./pages/Blog"));
const CareerTips = lazy(() => import("./pages/CareerTips"));
const ApiReference = lazy(() => import("./pages/ApiReference"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));

// Minimal page-level loading spinner
function PageLoader() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      width: "100%",
      background: "#ffffff",
    }}>
      <div style={{
        width: 32,
        height: 32,
        border: "3px solid rgba(0, 0, 0, 0.08)",
        borderTopColor: "#000000",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/career-tips" element={<CareerTips />} />
          <Route path="/api-reference" element={<ApiReference />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="projects" element={<Projects />} />
            <Route path="resume" element={<Resume />} />
            <Route path="job" element={<Job />} />
            <Route path="history" element={<History />} />
            <Route path="coach" element={<Coach />} />
            <Route path="github" element={<GithubAnalyzer />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
