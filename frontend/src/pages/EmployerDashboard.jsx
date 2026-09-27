import { Link } from "react-router-dom";
import { getStoredUser } from "../utils/auth";

function EmployerDashboard() {
  const user = getStoredUser();

  return (
    <div className="page-container">
      <section className="dashboard-welcome momentum-banner">
        <span className="eyebrow">Employer workspace</span>
        <h1>Make room for new talent, {user?.fullName || "Employer"}.</h1>
        <p>Meet motivated students, share meaningful work, and help someone take their next step.</p>
      </section>

      <Link className="profile-prompt employer-profile-prompt" to="/employer/profile">
        <span className="profile-prompt-mark" aria-hidden="true">CO</span>
        <span><strong>Tell students about your company</strong><small>Add your industry, location, website, and company story.</small></span>
        <span className="profile-prompt-action">Build company profile <span aria-hidden="true">-&gt;</span></span>
      </Link>

      <div className="dashboard-grid">
        <Link className="dashboard-card" to="/employer/post-opportunity">
          <h2>Post Opportunity</h2>
          <p>Create a new WIL opportunity.</p>
        </Link>

        <Link className="dashboard-card" to="/employer/opportunities">
          <h2>Manage Opportunities</h2>
          <p>View and manage your posted opportunities.</p>
        </Link>

        <Link className="dashboard-card" to="/employer/applicants">
          <h2>Applicants</h2>
          <p>Review student applications.</p>
        </Link>

        <Link className="dashboard-card" to="/employer/profile">
          <h2>Company Profile</h2>
          <p>Manage your company information.</p>
        </Link>
      </div>
    </div>
  );
}

export default EmployerDashboard;