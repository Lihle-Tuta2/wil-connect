import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { getStoredUser } from "../utils/auth";
import LogoMark from "../components/LogoMark";

function StudentDashboard() {
  const user = getStoredUser();
  const token = localStorage.getItem("token");
  const [applications, setApplications] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [savedWILs, setSavedWILs] = useState([]);

  useEffect(() => {
    let isCurrent = true;

    const loadDashboard = async () => {
      const results = await Promise.allSettled([
        axios.get("http://localhost:5000/api/applications/my", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/opportunities"),
        axios.get("http://localhost:5000/api/saved-wils", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!isCurrent) return;

      setApplications(results[0].status === "fulfilled" ? results[0].value.data.applications || [] : []);
      setOpportunities(results[1].status === "fulfilled" ? results[1].value.data.opportunities || [] : []);
      setSavedWILs(results[2].status === "fulfilled" ? results[2].value.data.savedWILs || [] : []);
    };

    void loadDashboard();

    return () => {
      isCurrent = false;
    };
  }, [token]);

  const displayName = user?.fullName?.trim()?.split(/\s+/)[0] || "Student";

  return (
    <div className="page-container student-dashboard">
      <div className="dashboard-welcome">
        <span className="eyebrow">Your student journey</span>
        <h1>Good things grow from here, {displayName}.</h1>
        <p>Every skill you build is a step toward work that matters to you. Your next experience can start today.</p>
      </div>

      <Link className="profile-prompt" to="/student/profile">
        <span className="profile-prompt-mark" aria-hidden="true">01</span>
        <span><strong>Let employers meet the real you</strong><small>Add your studies, skills, and interests to your student profile.</small></span>
        <span className="profile-prompt-action">Build my profile <span aria-hidden="true">-&gt;</span></span>
      </Link>

      <div className="dashboard-stats">
        <Link className="stat-card" to="/student/applications">
          <span>Applications</span>
          <strong>{applications.length}</strong>
          <small>View your applications</small>
        </Link>
        <Link className="stat-card" to="/student/saved">
          <span>Saved WILs</span>
          <strong>{savedWILs.length}</strong>
          <small>Opportunities saved for later</small>
        </Link>
        <Link className="stat-card" to="/opportunities">
          <span>Available opportunities</span>
          <strong>{opportunities.length}</strong>
          <small>Explore open placements</small>
        </Link>
      </div>

      <div className="dashboard-panels">
        <section className="dashboard-panel">
          <div className="panel-heading">
            <h2>Recent Applications</h2>
            <Link to="/student/applications">View all</Link>
          </div>
          {applications.length === 0 ? (
            <p className="panel-empty">Your submitted applications will appear here.</p>
          ) : (
            <div className="dashboard-list">
              {applications.slice(0, 4).map((application) => (
                <div className="dashboard-list-row" key={application.ApplicationID}>
                  <span className="list-mark"><LogoMark alt="" /></span>
                  <span className="list-copy">
                    <strong>{application.Title}</strong>
                    <small>{application.CompanyName || "Company"}</small>
                  </span>
                  <span className="status">{application.Status}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-panel">
          <div className="panel-heading">
            <h2>Available WIL Opportunities</h2>
            <Link to="/opportunities">View all</Link>
          </div>
          {opportunities.length === 0 ? (
            <p className="panel-empty">New opportunities will appear here when available.</p>
          ) : (
            <div className="dashboard-list">
              {opportunities.slice(0, 4).map((opportunity) => (
                <Link
                  className="dashboard-list-row opportunity-list-row"
                  key={opportunity.OpportunityID}
                  to={`/opportunities/${opportunity.OpportunityID}`}
                >
                  <span className="list-mark"><LogoMark alt="" /></span>
                  <span className="list-copy">
                    <strong>{opportunity.Title}</strong>
                    <small>{opportunity.CompanyName} · {opportunity.Location}</small>
                  </span>
                  <span className="list-arrow" aria-hidden="true">&gt;</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default StudentDashboard;