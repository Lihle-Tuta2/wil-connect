import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function OpportunityDetails() {
  const { id } = useParams();

  const [opportunity, setOpportunity] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const companyLogo = opportunity?.LogoURL
    ? (/^https?:\/\//i.test(opportunity.LogoURL)
      ? opportunity.LogoURL
      : `http://localhost:5000${opportunity.LogoURL}`)
    : "";
  const companyInitial = opportunity?.CompanyName?.trim()?.charAt(0)?.toUpperCase() || "C";
  const companyWebsite = opportunity?.Website
    ? (/^https?:\/\//i.test(opportunity.Website) ? opportunity.Website : `https://${opportunity.Website}`)
    : "";

  useEffect(() => {
    const fetchOpportunity = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const response = await axios.get(
          `http://localhost:5000/api/opportunities/${id}`,
          { timeout: 12000 }
        );

        setOpportunity(response.data.opportunity || null);
        if (!response.data.opportunity) {
          setLoadError("This opportunity could not be found.");
        }
      } catch (error) {
        console.error(
          "Could not load opportunity",
          error
        );
        setLoadError(error.response?.data?.message || "Could not load this opportunity. Check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id, reloadCount]);

  const apply = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/applications/opportunity/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        "Application submitted successfully."
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Could not submit application."
      );
    }
  };

  const save = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/saved-wils/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        "Opportunity saved successfully."
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Could not save opportunity."
      );
    }
  };

  if (!opportunity) {
    return (
      <div className="page-container">
        {loading ? (
          "Loading opportunity..."
        ) : (
          <div className="opportunity-load-error">
            <h1>Opportunity unavailable</h1>
            <p className="error-message" role="alert">{loadError || "This opportunity could not be found."}</p>
            <button className="primary-btn" type="button" onClick={() => setReloadCount((count) => count + 1)}>Try Again</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page-container">

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      <div className="dashboard-card">

        <span className="status">
          {opportunity.Status}
        </span>

        <h1>{opportunity.Title}</h1>

        <p>
          {opportunity.Description}
        </p>

        {opportunity.CompanyName && (
          <section className="opportunity-company-profile">
            <div className="company-profile-heading">
              <span className="company-profile-mark">
                {companyLogo ? <img src={companyLogo} alt={`${opportunity.CompanyName} logo`} /> : <span>{companyInitial}</span>}
              </span>
              <div>
                <span className="eyebrow">Meet your potential team</span>
                <h2>{opportunity.CompanyName}</h2>
                <p>{opportunity.Industry || "Work-integrated learning partner"}</p>
              </div>
              {companyWebsite && <a href={companyWebsite} target="_blank" rel="noreferrer">Company website <span aria-hidden="true">-&gt;</span></a>}
            </div>
            {opportunity.CompanyDescription && <p className="company-profile-description">{opportunity.CompanyDescription}</p>}
          </section>
        )}

        <p>
          <strong>Field of Study:</strong>{" "}
          {opportunity.FieldOfStudy}
        </p>

        <p>
          <strong>Location:</strong>{" "}
          {opportunity.Location}
        </p>

        <p>
          <strong>Employment Type:</strong>{" "}
          {opportunity.EmploymentType}
        </p>

        <p>
          <strong>Closing Date:</strong>{" "}
          {opportunity.ClosingDate}
        </p>

        {user?.role === "Student" && (
          <div className="detail-actions">

            <button
              className="primary-btn"
              onClick={apply}
            >
              Apply Now
            </button>

            <button
              className="primary-btn"
              onClick={save}
            >
              Save Opportunity
            </button>

          </div>
        )}

        {!token && (
          <div className="detail-actions">
            <Link
              className="primary-btn"
              to="/login"
              state={{ from: { pathname: `/opportunities/${id}` } }}
            >
              Log in to apply
            </Link>
            <Link
              className="secondary-btn"
              to="/register"
              state={{ role: "Student", from: { pathname: `/opportunities/${id}` } }}
            >
              Create Student Account
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default OpportunityDetails;