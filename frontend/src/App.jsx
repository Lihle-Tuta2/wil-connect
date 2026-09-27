import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";

import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import Opportunities from "./pages/Opportunities";
import OpportunityDetails from "./pages/OpportunityDetails";
import MyApplications from "./pages/MyApplications";
import SavedWILs from "./pages/SavedWILs";

import EmployerDashboard from "./pages/EmployerDashboard";
import CompanyProfile from "./pages/CompanyProfile";
import PostOpportunity from "./pages/PostOpportunity";
import ManageOpportunities from "./pages/ManageOpportunities";
import Applicants from "./pages/Applicants";

import AdminDashboard from "./pages/AdminDashboard";
import { getStoredUser } from "./utils/auth";
import LogoMark from "./components/LogoMark";
import homePageImage from "./assets/home page.jpeg";

import "./App.css";

function Home() {
  return (
    <main className="home-page">
      <section className="hero-section page-container">
        <div className="hero-copy">
          <span className="eyebrow">Your next chapter starts here</span>
          <h1>LEARN.<br /><span>CONNECT.</span><br />WORK.</h1>
          <p>What you study can take you somewhere real. Find a placement that helps you grow your skills, meet great people, and start building the future you want.</p>
          <div className="hero-actions">
            <a className="primary-btn" href="/opportunities">Find your opportunity</a>
            <a className="secondary-btn" href="/register">Join WIL Connect</a>
          </div>
          <div className="hero-proof">
            <span><strong>01</strong> Explore real roles</span>
            <span><strong>02</strong> Show what you can do</span>
            <span><strong>03</strong> Start your story</span>
          </div>
        </div>
        <div className="hero-visual">
          <img src={homePageImage} alt="WIL Connect student, company, and opportunity workspace previews" />
          <div className="hero-note"><span className="pulse-dot" /> Your next chapter starts here</div>
        </div>
      </section>
      <section className="value-strip">
        <div className="value-strip-inner">
          <span>For the path you're building</span>
          <strong>Turn what you learn into what you can do.</strong>
          <a href="/opportunities">See what is available <span aria-hidden="true">-&gt;</span></a>
        </div>
      </section>

      <section className="home-contact" id="contact">
        <div className="contact-copy">
          <span className="eyebrow">Contact & next steps</span>
          <h2>There’s more than one way to get started.</h2>
          <p>Students can explore placements and ask their institution’s WIL coordinator about placement requirements. Employers can set up a company profile and share an opportunity directly with students.</p>
        </div>
        <div className="contact-actions">
          <Link className="primary-btn" to="/opportunities">I’m a student</Link>
          <Link className="secondary-btn" to="/register" state={{ role: "Employer" }}>I’m an employer</Link>
        </div>
      </section>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

function AppShell() {
  const { pathname } = useLocation();
  const token = localStorage.getItem("token");
  const user = getStoredUser();
  const isHome = pathname === "/";
  const isWorkspace = Boolean(
    token && user && pathname !== "/" && pathname !== "/login" && pathname !== "/register"
  );

  return (
    <div className={`app-shell${isWorkspace ? " workspace-shell" : ""}${isHome ? " home-shell" : ""}`}>
      <Navbar />
      <div className={`route-shell${isWorkspace ? " workspace-route-shell" : ""}`}>
        {isWorkspace && (
          <header className="workspace-topbar">
            <div className="workspace-user">
              <span className="workspace-avatar">
                <LogoMark alt="" />
              </span>
              <span>
                <strong>{user.fullName || user.role}</strong>
                <small>{user.role} account</small>
              </span>
            </div>
          </header>
        )}

        <Routes>

        {/* PUBLIC PAGES */}

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/opportunities"
          element={<Opportunities />}
        />

        <Route
          path="/opportunities/:id"
          element={<OpportunityDetails />}
        />


        {/* STUDENT PAGES */}

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRole="Student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRole="Student">
              <StudentProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/applications"
          element={
            <ProtectedRoute allowedRole="Student">
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/saved"
          element={
            <ProtectedRoute allowedRole="Student">
              <SavedWILs />
            </ProtectedRoute>
          }
        />


        {/* EMPLOYER PAGES */}

        <Route
          path="/employer/dashboard"
          element={
            <ProtectedRoute allowedRole="Employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/profile"
          element={
            <ProtectedRoute allowedRole="Employer">
              <CompanyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/post-opportunity"
          element={
            <ProtectedRoute allowedRole="Employer">
              <PostOpportunity />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/opportunities"
          element={
            <ProtectedRoute allowedRole="Employer">
              <ManageOpportunities />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/applicants"
          element={
            <ProtectedRoute allowedRole="Employer">
              <Applicants />
            </ProtectedRoute>
          }
        />


        {/* ADMIN */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<div className="page-container not-found"><span className="eyebrow">404</span><h1>That page is not here.</h1><p>Return to the WIL Connect home page and keep exploring.</p><a className="primary-btn" href="/">Back home</a></div>} />

        </Routes>

        <Footer />
      </div>
    </div>
  );
}

export default App;