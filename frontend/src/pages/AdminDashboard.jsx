import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getStoredUser } from "../utils/auth";

const API = "http://localhost:5000/api/admin";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [reloadCount, setReloadCount] = useState(0);
  const [search, setSearch] = useState("");
  const [updatingCompany, setUpdatingCompany] = useState(null);
  const [notice, setNotice] = useState("");
  const token = localStorage.getItem("token");
  const user = getStoredUser();
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    let isCurrent = true;

    const loadDashboard = async () => {
      setLoading(true);
      const results = await Promise.allSettled([
        axios.get(`${API}/users`, { headers, timeout: 12000 }),
        axios.get(`${API}/companies`, { headers, timeout: 12000 }),
        axios.get(`${API}/opportunities`, { headers, timeout: 12000 }),
      ]);

      if (!isCurrent) return;

      const nextErrors = {};
      if (results[0].status === "fulfilled") {
        setUsers(results[0].value.data.users || []);
      } else {
        nextErrors.users = results[0].reason.response?.data?.message || "Could not load accounts.";
      }
      if (results[1].status === "fulfilled") {
        setCompanies(results[1].value.data.companies || []);
      } else {
        nextErrors.companies = results[1].reason.response?.data?.message || "Could not load companies.";
      }
      if (results[2].status === "fulfilled") {
        setOpportunities(results[2].value.data.opportunities || []);
      } else {
        nextErrors.opportunities = results[2].reason.response?.data?.message || "Could not load opportunities.";
      }
      setErrors(nextErrors);
      setLoading(false);
    };

    void loadDashboard();
    return () => {
      isCurrent = false;
    };
  }, [token, reloadCount]);

  const students = useMemo(() => users.filter((item) => item.Role === "Student"), [users]);
  const pendingCompanies = useMemo(
    () => companies.filter((company) => company.VerificationStatus?.toLowerCase() === "pending"),
    [companies]
  );
  const filteredStudents = useMemo(() => students.filter((student) =>
    `${student.FullName || ""} ${student.Email || ""} ${student.PhoneNumber || ""}`
      .toLowerCase().includes(search.toLowerCase())
  ), [students, search]);
  const filteredCompanies = useMemo(() => companies.filter((company) =>
    `${company.CompanyName || ""} ${company.Industry || ""} ${company.Location || ""}`
      .toLowerCase().includes(search.toLowerCase())
  ), [companies, search]);
  const filteredOpportunities = useMemo(() => opportunities.filter((opportunity) =>
    `${opportunity.Title || ""} ${opportunity.CompanyName || ""} ${opportunity.FieldOfStudy || ""}`
      .toLowerCase().includes(search.toLowerCase())
  ), [opportunities, search]);

  const updateCompanyStatus = async (company, status) => {
    setUpdatingCompany(company.EmployerID);
    setNotice("");
    try {
      await axios.put(`${API}/companies/${company.EmployerID}/${status}`, {}, { headers });
      const verificationStatus = status === "approve" ? "Approved" : "Rejected";
      setCompanies((current) => current.map((item) => item.EmployerID === company.EmployerID
        ? { ...item, VerificationStatus: verificationStatus }
        : item
      ));
      setNotice(`${company.CompanyName} ${verificationStatus.toLowerCase()}.`);
    } catch (error) {
      setNotice(error.response?.data?.message || "Could not update company status.");
    } finally {
      setUpdatingCompany(null);
    }
  };

  const firstName = user?.fullName?.trim().split(/\s+/)[0] || "Admin";

  return (
    <main className="page-container admin-dashboard-page" id="admin-dashboard">
      <header className="admin-welcome">
        <div>
          <span className="eyebrow">Administration</span>
          <h1>Welcome back, {firstName}</h1>
          <p>Manage student accounts, company verification, and WIL opportunities.</p>
        </div>
        <label className="admin-search">
          <span className="sr-only">Search admin records</span>
          <input
            type="search"
            placeholder="Search accounts or opportunities"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </header>

      <section className="admin-summary" aria-label="Platform overview">
        <a className="admin-summary-card" href="#admin-users">
          <span className="admin-summary-icon">ST</span>
          <span className="admin-summary-copy"><small>Student accounts</small><strong>{students.length}</strong></span>
        </a>
        <a className="admin-summary-card" href="#admin-companies">
          <span className="admin-summary-icon">CO</span>
          <span className="admin-summary-copy"><small>Company accounts</small><strong>{companies.length}</strong></span>
          {pendingCompanies.length > 0 && <span className="admin-summary-alert">{pendingCompanies.length} pending</span>}
        </a>
        <a className="admin-summary-card" href="#admin-opportunities">
          <span className="admin-summary-icon">WIL</span>
          <span className="admin-summary-copy"><small>WIL opportunities</small><strong>{opportunities.length}</strong></span>
        </a>
      </section>

      {notice && <div className="message admin-notice" role="status">{notice}</div>}

      <section className="admin-data-section" id="admin-users">
        <div className="admin-section-heading">
          <div><h2>Student Accounts</h2><p>Registered students on the platform</p></div>
          <span className="admin-section-count">{students.length}</span>
        </div>
        {errors.users ? <div className="error-message admin-load-error" role="alert">{errors.users}<button type="button" onClick={() => setReloadCount((count) => count + 1)}>Try again</button></div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Student</th><th>Email</th><th>Phone</th><th>Account</th></tr></thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.UserID}>
                    <td><span className="admin-person"><span className="admin-initial">{student.FullName?.charAt(0)?.toUpperCase() || "S"}</span><strong>{student.FullName}</strong></span></td>
                    <td>{student.Email}</td>
                    <td>{student.PhoneNumber || "Not provided"}</td>
                    <td><span className="admin-role">Student</span></td>
                  </tr>
                ))}
                {!loading && filteredStudents.length === 0 && <tr><td className="admin-table-empty" colSpan="4">No student accounts match this search.</td></tr>}
                {loading && <tr><td className="admin-table-empty" colSpan="4">Loading student accounts...</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-data-section" id="admin-companies">
        <div className="admin-section-heading">
          <div><h2>Company Accounts</h2><p>Review employer registrations and verification status</p></div>
          <span className="admin-section-count">{companies.length}</span>
        </div>
        {errors.companies ? <div className="error-message admin-load-error" role="alert">{errors.companies}<button type="button" onClick={() => setReloadCount((count) => count + 1)}>Try again</button></div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Company</th><th>Industry</th><th>Location</th><th>Status</th><th>Review</th></tr></thead>
              <tbody>
                {filteredCompanies.map((company) => {
                  const pending = company.VerificationStatus?.toLowerCase() === "pending";
                  return (
                    <tr key={company.EmployerID}>
                      <td><span className="admin-person"><span className="admin-company-icon">{company.CompanyName?.charAt(0)?.toUpperCase() || "C"}</span><span><strong>{company.CompanyName}</strong><small>{company.Email}</small></span></span></td>
                      <td>{company.Industry || "Not provided"}</td>
                      <td>{company.Location || "Not provided"}</td>
                      <td><span className={`admin-status status-${company.VerificationStatus?.toLowerCase() || "pending"}`}>{company.VerificationStatus || "Pending"}</span></td>
                      <td>{pending ? (
                        <div className="admin-row-actions">
                          <button className="admin-approve" type="button" disabled={updatingCompany === company.EmployerID} onClick={() => updateCompanyStatus(company, "approve")}>Approve</button>
                          <button className="admin-reject" type="button" disabled={updatingCompany === company.EmployerID} onClick={() => updateCompanyStatus(company, "reject")}>Reject</button>
                        </div>
                      ) : <span className="admin-muted">Reviewed</span>}</td>
                    </tr>
                  );
                })}
                {!loading && filteredCompanies.length === 0 && <tr><td className="admin-table-empty" colSpan="5">No company accounts match this search.</td></tr>}
                {loading && <tr><td className="admin-table-empty" colSpan="5">Loading company accounts...</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-data-section" id="admin-opportunities">
        <div className="admin-section-heading">
          <div><h2>WIL Opportunities</h2><p>Opportunities currently listed on the platform</p></div>
          <span className="admin-section-count">{opportunities.length}</span>
        </div>
        {errors.opportunities ? <div className="error-message admin-load-error" role="alert">{errors.opportunities}<button type="button" onClick={() => setReloadCount((count) => count + 1)}>Try again</button></div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Opportunity</th><th>Company</th><th>Field</th><th>Location</th><th>Status</th></tr></thead>
              <tbody>
                {filteredOpportunities.map((opportunity) => (
                  <tr key={opportunity.OpportunityID}>
                    <td><strong>{opportunity.Title}</strong><small className="admin-cell-secondary">{opportunity.EmploymentType || "WIL placement"}</small></td>
                    <td>{opportunity.CompanyName || "Company"}</td>
                    <td>{opportunity.FieldOfStudy || "Not specified"}</td>
                    <td>{opportunity.Location || "Not specified"}</td>
                    <td><span className={`admin-status status-${opportunity.Status?.toLowerCase() || "open"}`}>{opportunity.Status || "Open"}</span></td>
                  </tr>
                ))}
                {!loading && filteredOpportunities.length === 0 && <tr><td className="admin-table-empty" colSpan="5">No opportunities match this search.</td></tr>}
                {loading && <tr><td className="admin-table-empty" colSpan="5">Loading opportunities...</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;