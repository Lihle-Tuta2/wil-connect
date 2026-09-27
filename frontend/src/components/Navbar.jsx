import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CirclePlus,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import { getStoredUser } from "../utils/auth";
import Brand from "./Brand";

function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const isAuthPage = pathname === "/login" || pathname === "/register";

  const token = localStorage.getItem("token");
  const user = getStoredUser();
  const isWorkspace = Boolean(
    token && user && pathname !== "/" && pathname !== "/login" && pathname !== "/register"
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLogoutOpen(false);
    navigate("/login");
  };

  const logoutDialog = logoutOpen && (
    <div className="logout-backdrop" onClick={() => setLogoutOpen(false)}>
      <section className="logout-dialog" role="dialog" aria-modal="true" aria-labelledby="logout-title" onClick={(event) => event.stopPropagation()}>
        <span className="logout-dialog-mark" aria-hidden="true">!</span>
        <h2 id="logout-title">Confirm Logout</h2>
        <p>Are you sure you want to log out of your WIL Connect account?</p>
        <div className="logout-dialog-actions">
          <button className="secondary-btn" type="button" onClick={() => setLogoutOpen(false)}>Cancel</button>
          <button className="primary-btn" type="button" onClick={logout}>Log out</button>
        </div>
      </section>
    </div>
  );

  if (isWorkspace) {
    return (
      <>
      <aside className="workspace-sidebar">
        <Brand />
        <p className="sidebar-label">{user.role} workspace</p>
        <nav aria-label="Workspace navigation">
          {user.role === "Student" && (
            <>
              <NavLink to="/student/dashboard"><LayoutDashboard aria-hidden="true" /><span>Dashboard</span></NavLink>
              <NavLink to="/opportunities"><BriefcaseBusiness aria-hidden="true" /><span>Opportunities</span></NavLink>
              <NavLink to="/student/applications"><FileText aria-hidden="true" /><span>My Applications</span></NavLink>
              <NavLink to="/student/profile"><UserRound aria-hidden="true" /><span>Student Profile</span></NavLink>
              <NavLink to="/student/saved"><Bookmark aria-hidden="true" /><span>Saved WILs</span></NavLink>
            </>
          )}
          {user.role === "Employer" && (
            <>
              <NavLink to="/employer/dashboard"><LayoutDashboard aria-hidden="true" /><span>Dashboard</span></NavLink>
              <NavLink to="/employer/opportunities"><BriefcaseBusiness aria-hidden="true" /><span>My Opportunities</span></NavLink>
              <NavLink to="/employer/post-opportunity"><CirclePlus aria-hidden="true" /><span>Post Opportunity</span></NavLink>
              <NavLink to="/employer/applicants"><UsersRound aria-hidden="true" /><span>Applicants</span></NavLink>
              <NavLink to="/employer/profile"><Building2 aria-hidden="true" /><span>Company Profile</span></NavLink>
            </>
          )}
          {user.role === "Admin" && (
            <>
              <NavLink to="/admin/dashboard" end><ShieldCheck aria-hidden="true" /><span>Dashboard</span></NavLink>
              <a href="/admin/dashboard#admin-users"><GraduationCap aria-hidden="true" /><span>Student Accounts</span></a>
              <a href="/admin/dashboard#admin-companies"><Building2 aria-hidden="true" /><span>Company Accounts</span></a>
              <a href="/admin/dashboard#admin-opportunities"><BriefcaseBusiness aria-hidden="true" /><span>WIL Opportunities</span></a>
            </>
          )}
        </nav>
        <button className="sidebar-logout" onClick={() => setLogoutOpen(true)}><LogOut aria-hidden="true" /><span>Log out</span></button>
      </aside>
      {logoutDialog}
      </>
    );
  }

  return (
    <>
    <header className={`navbar${isAuthPage ? " navbar-auth" : ""}`}>
      <Brand />

      <nav>
        <NavLink to="/" end>
          Home
        </NavLink>

        <NavLink to="/opportunities">
          Opportunities
        </NavLink>

        {!token && (
          <>
            <NavLink to="/about">About</NavLink>
            <a href="/#contact">Contact</a>
          </>
        )}

        {!token && (
          <>
            <NavLink to="/login">
              Login
            </NavLink>

            <NavLink className="nav-cta" to="/register">
              Register
            </NavLink>
          </>
        )}

        {token && user?.role === "Student" && (
          <>
            <Link to="/student/dashboard">
              Dashboard
            </Link>

            <Link to="/student/profile">
              Profile
            </Link>

            <Link to="/student/applications">
              Applications
            </Link>

            <Link to="/student/saved">
              Saved
            </Link>

            <button
              className="primary-btn"
              onClick={() => setLogoutOpen(true)}
            >
              Logout
            </button>
          </>
        )}

        {token && user?.role === "Employer" && (
          <>
            <Link to="/employer/dashboard">
              Dashboard
            </Link>

            <Link to="/employer/profile">
              Profile
            </Link>

            <Link to="/employer/post-opportunity">
              Post WIL
            </Link>

            <Link to="/employer/applicants">
              Applicants
            </Link>

            <button
              className="primary-btn"
              onClick={() => setLogoutOpen(true)}
            >
              Logout
            </button>
          </>
        )}

        {token && user?.role === "Admin" && (
          <>
            <Link to="/admin/dashboard">
              Admin Dashboard
            </Link>

            <button
              className="primary-btn"
              onClick={() => setLogoutOpen(true)}
            >
              Logout
            </button>
          </>
        )}

      </nav>
    </header>
    {logoutDialog}
    </>
  );
}

export default Navbar;