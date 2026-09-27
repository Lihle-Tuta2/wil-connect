import { useEffect, useState } from "react";
import axios from "axios";

function Applicants() {
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState("");

  const [applicants, setApplicants] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/opportunities/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOpportunities(response.data.opportunities || []);
      } catch (error) {
        console.error(
          "Could not load opportunities",
          error
        );
      }
    };

    loadOpportunities();
  }, [token]);

  const loadApplicants = async (opportunityId) => {
    setSelectedOpportunity(opportunityId);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/applications/opportunity/${opportunityId}/applicants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplicants(response.data.applicants || []);
    } catch (error) {
      console.error(
        "Could not load applicants",
        error
      );

      setApplicants([]);
    }
  };

  const updateStatus = async (
    applicationId,
    status
  ) => {
    try {
      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplicants((current) =>
        current.map((applicant) =>
          applicant.ApplicationID === applicationId
            ? {
                ...applicant,
                Status: status,
              }
            : applicant
        )
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Could not update application."
      );
    }
  };

  return (
    <div className="page-container">
      <h1>Applicants</h1>

      <p>
        Review students who applied for your
        opportunities.
      </p>

      <div className="form-card filter-card">
        <label>
          Select Opportunity
        </label>

        <select
          value={selectedOpportunity}
          onChange={(e) =>
            loadApplicants(e.target.value)
          }
        >
          <option value="">
            Select an opportunity
          </option>

          {opportunities.map((opportunity) => (
            <option
              key={opportunity.OpportunityID}
              value={opportunity.OpportunityID}
            >
              {opportunity.Title}
            </option>
          ))}
        </select>
      </div>

      {selectedOpportunity && (
        <div className="opportunity-grid">
          {applicants.length === 0 ? (
            <div className="dashboard-card">
              <h3>No applicants</h3>
              <p>
                No students have applied yet.
              </p>
            </div>
          ) : (
            applicants.map((applicant) => (
              <div
                className="dashboard-card"
                key={applicant.ApplicationID}
              >
                <h3>
                  {applicant.FullName}
                </h3>

                <p>
                  Email: {applicant.Email}
                </p>

                <p>
                  Student Number:{" "}
                  {applicant.StudentNumber}
                </p>

                <p>
                  Field of Study:{" "}
                  {applicant.FieldOfStudy}
                </p>

                <p>
                  Status:{" "}
                  {applicant.Status}
                </p>

                <div className="action-row">
                  <button
                    className="primary-btn"
                    onClick={() =>
                      updateStatus(
                        applicant.ApplicationID,
                        "Under Review"
                      )
                    }
                  >
                    Review
                  </button>

                  <button
                    className="primary-btn"
                    onClick={() =>
                      updateStatus(
                        applicant.ApplicationID,
                        "Accepted"
                      )
                    }
                  >
                    Accept
                  </button>

                  <button
                    className="primary-btn"
                    onClick={() =>
                      updateStatus(
                        applicant.ApplicationID,
                        "Rejected"
                      )
                    }
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Applicants;