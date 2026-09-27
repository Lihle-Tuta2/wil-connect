import { useEffect, useState } from "react";
import axios from "axios";
import LogoMark from "../components/LogoMark";

const statusFilters = ["All", "Pending", "Under Review", "Accepted", "Rejected", "Withdrawn"];

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/applications/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 12000,
          }
        );

        setApplications(response.data.applications || []);
      } catch (error) {
        console.error(
          "Could not load applications",
          error
        );
      } finally {
        setLoading(false);
      }
    };
    loadApplications();
  }, [token]);

  const withdrawApplication = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/applications/${id}/withdraw`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications((current) => current.map((application) =>
        application.ApplicationID === id
          ? { ...application, Status: "Withdrawn" }
          : application
      ));
    } catch (error) {
      alert(error.response?.data?.message || "Could not withdraw application.");
    }
  };

  const filteredApplications = applications.filter((application) => {
    const matchesStatus = activeFilter === "All" || application.Status === activeFilter;
    const matchesSearch = `${application.Title || ""} ${application.CompanyName || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="page-container applications-page">
      <div className="applications-heading">
        <div>
          <h1>My Applications</h1>
          <p>Keep track of the opportunities you have applied for.</p>
        </div>
        <span className="applications-total">{applications.length} total</span>
      </div>

      <div className="application-toolbar">
        <div className="application-tabs" role="tablist" aria-label="Filter applications by status">
          {statusFilters.map((filter) => (
            <button
              className={`application-tab${activeFilter === filter ? " is-active" : ""}`}
              key={filter}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
              <span>{filter === "All" ? applications.length : applications.filter((item) => item.Status === filter).length}</span>
            </button>
          ))}
        </div>
        <label className="application-search">
          <span className="sr-only">Search applications</span>
          <input
            type="search"
            placeholder="Search company or role"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>
      </div>

      {loading ? (
        <div className="application-empty">Loading your applications...</div>
      ) : filteredApplications.length === 0 ? (
        <div className="application-empty">
          <h2>{applications.length ? "No matching applications" : "No applications yet"}</h2>
          <p>{applications.length ? "Try another status or search term." : "Applications you submit will appear here."}</p>
        </div>
      ) : (
        <div className="application-grid">
          {filteredApplications.map((application) => {
            const companyName = application.CompanyName || "Company";
            const statusClass = application.Status?.toLowerCase().replaceAll(" ", "-");

            return (
              <article className="application-card" key={application.ApplicationID}>
                <div className="application-card-top">
                  <span className="company-mark" aria-label={`${companyName} company mark`}>
                    <LogoMark alt="" />
                  </span>
                  <span className={`application-status status-${statusClass}`}>{application.Status}</span>
                </div>
                <h2>{application.Title}</h2>
                <p className="application-company">{companyName}</p>
                <div className="application-meta">
                  <span>{application.FieldOfStudy || "WIL placement"}</span>
                  <span>{application.Location || "Location not specified"}</span>
                </div>
                <div className="application-card-footer">
                  <span>Applied {application.DateApplied ? new Date(application.DateApplied).toLocaleDateString() : "recently"}</span>
                  {application.Status !== "Withdrawn" && (
                    <button
                      className="text-action"
                      type="button"
                      onClick={() => withdrawApplication(application.ApplicationID)}
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyApplications;