import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import OpportunityCard from "../components/OpportunityCard";
import { getStoredUser } from "../utils/auth";

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [fieldFilter, setFieldFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const user = getStoredUser();

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/opportunities",
          { timeout: 12000 }
        );

        setOpportunities(response.data.opportunities || []);
      } catch (error) {
        console.error("Could not load opportunities", error);
        setLoadError(error.response?.data?.message || "Could not load opportunities. Try again in a moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const locations = [...new Set(opportunities.map((item) => item.Location).filter(Boolean))];
  const fields = [...new Set(opportunities.map((item) => item.FieldOfStudy).filter(Boolean))];
  const filteredOpportunities = opportunities.filter((item) => {
    const matchesSearch = `${item.Title || ""} ${item.CompanyName || ""} ${item.Industry || ""} ${item.FieldOfStudy || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || item.Location === locationFilter;
    const matchesField = !fieldFilter || item.FieldOfStudy === fieldFilter;
    return matchesSearch && matchesLocation && matchesField;
  });

  return (
    <main className="page-container opportunity-search-page">
      <div className="opportunity-page-heading">
        <div>
          <span className="eyebrow">A good place to begin</span>
          <h1>Find work that moves you forward.</h1>
          <p>Explore work-integrated learning placements and find a team where you can learn by doing.</p>
        </div>
        {user?.role === "Employer" ? (
          <Link className="primary-btn" to="/employer/post-opportunity">Post Opportunity</Link>
        ) : !user ? (
          <div className="opportunity-heading-actions">
            <Link
              className="primary-btn"
              to="/login"
              state={{ from: { pathname: "/employer/post-opportunity" } }}
            >
              Employer? Log in to post
            </Link>
            <Link
              className="secondary-btn"
              to="/register"
              state={{ role: "Employer", from: { pathname: "/employer/post-opportunity" } }}
            >
              Create employer account
            </Link>
          </div>
        ) : null}
      </div>

      <div className="opportunity-filter-panel" aria-label="Filter opportunities">
        <label className="job-search-input">
          <span className="sr-only">Search roles or companies</span>
          <input
            type="search"
            placeholder="Job title, skill, or company"
            aria-label="Search roles or companies"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>
        <label>
          <span className="sr-only">Filter by location</span>
          <select aria-label="Filter by location" value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)}>
            <option value="">Any location</option>
            {locations.map((location) => <option key={location} value={location}>{location}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Filter by field of study</span>
          <select aria-label="Filter by field of study" value={fieldFilter} onChange={(event) => setFieldFilter(event.target.value)}>
            <option value="">Any study area</option>
            {fields.map((field) => <option key={field} value={field}>{field}</option>)}
          </select>
        </label>
      </div>

      <div className="job-results-heading">
        <h2>Open opportunities</h2>
        {!loading && <span>{filteredOpportunities.length} {filteredOpportunities.length === 1 ? "role" : "roles"}</span>}
      </div>

      {loading && <div className="dashboard-card empty-state">Finding opportunities for you…</div>}
      {loadError && <div className="error-message" role="alert">{loadError}</div>}

      <div className="opportunity-grid opportunity-results">
        {filteredOpportunities.map((opportunity) => (
          <OpportunityCard
            key={opportunity.OpportunityID}
            opportunity={{
              opportunityId: opportunity.OpportunityID,
              title: opportunity.Title,
              companyName: opportunity.CompanyName,
              companyLogo: opportunity.LogoURL,
              location: opportunity.Location,
              fieldOfStudy: opportunity.FieldOfStudy,
              employmentType: opportunity.EmploymentType,
              closingDate: opportunity.ClosingDate,
              status: opportunity.Status,
            }}
          />
        ))}
      </div>
      {!loading && !loadError && filteredOpportunities.length === 0 && (
        <div className="dashboard-card empty-state">
          <h3>No matching opportunities yet</h3>
          <p>Try a different search or widen your filters. New placements are added as employers post them.</p>
        </div>
      )}
    </main>
  );
}

export default Opportunities;