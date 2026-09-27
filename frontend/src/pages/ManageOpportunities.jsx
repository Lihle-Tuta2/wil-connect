import { useEffect, useState } from "react";
import axios from "axios";

function ManageOpportunities() {
  const [opportunities, setOpportunities] = useState([]);

  const token = localStorage.getItem("token");

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

  const deleteOpportunity = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this opportunity?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/opportunities/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOpportunities((current) =>
        current.filter(
          (item) => item.OpportunityID !== id
        )
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Could not delete opportunity."
      );
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadOpportunities());
  }, []);

  return (
    <div className="page-container">
      <h1>Manage Opportunities</h1>

      <p>
        View and manage your posted WIL opportunities.
      </p>

      {opportunities.length === 0 ? (
        <div className="dashboard-card">
          <h3>No opportunities yet</h3>
          <p>
            Your posted opportunities will appear here.
          </p>
        </div>
      ) : (
        <div className="opportunity-grid">
          {opportunities.map((opportunity) => (
            <div
              className="dashboard-card"
              key={opportunity.OpportunityID}
            >
              <span className="status">
                {opportunity.Status}
              </span>

              <h3>{opportunity.Title}</h3>

              <p>
                {opportunity.Description}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {opportunity.Location}
              </p>

              <p>
                <strong>Closing Date:</strong>{" "}
                {opportunity.ClosingDate}
              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  deleteOpportunity(
                    opportunity.OpportunityID
                  )
                }
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageOpportunities;