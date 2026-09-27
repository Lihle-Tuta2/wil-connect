import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";

const API_ORIGIN = "http://localhost:5000";

function OpportunityCard({ opportunity }) {
  const companyLogo = opportunity.companyLogo
    ? (/^https?:\/\//i.test(opportunity.companyLogo)
      ? opportunity.companyLogo
      : `${API_ORIGIN}${opportunity.companyLogo}`)
    : "";
  const companyInitial = opportunity.companyName?.trim()?.charAt(0)?.toUpperCase() || "C";

  return (
    <article className="opportunity-card job-listing">
      <Link className="job-listing-company-logo" to={`/opportunities/${opportunity.opportunityId}`} aria-label={`${opportunity.companyName || "Company"} opportunity`}>
        {companyLogo
          ? <img src={companyLogo} alt={`${opportunity.companyName} logo`} />
          : <span>{companyInitial}</span>}
      </Link>
      <div className="job-listing-content">
        <div className="job-listing-heading">
          <div>
            <Link className="job-listing-title" to={`/opportunities/${opportunity.opportunityId}`}>{opportunity.title}</Link>
            <p className="job-listing-company">{opportunity.companyName || "Company"}</p>
          </div>
          <span className="status">{opportunity.status || "Open"}</span>
        </div>
        <div className="job-listing-details">
          <span><MapPin aria-hidden="true" />{opportunity.location || "Location not specified"}</span>
          {opportunity.employmentType && <span>{opportunity.employmentType}</span>}
          {opportunity.fieldOfStudy && <span>{opportunity.fieldOfStudy}</span>}
          {opportunity.closingDate && <span>Closes {new Date(opportunity.closingDate).toLocaleDateString()}</span>}
        </div>
      </div>
      <Link className="job-listing-action" to={`/opportunities/${opportunity.opportunityId}`} aria-label={`View ${opportunity.title}`}>
        <ArrowUpRight aria-hidden="true" />
      </Link>
    </article>
  );
}

export default OpportunityCard;