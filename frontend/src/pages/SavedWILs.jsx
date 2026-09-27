import { useEffect, useState } from "react";
import axios from "axios";

function SavedWILs() {
  const [savedWILs, setSavedWILs] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadSavedWILs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/saved-wils",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSavedWILs(response.data.savedWILs || []);
      } catch (error) {
        console.error(
          "Could not load saved WILs",
          error
        );
      }
    };

    loadSavedWILs();
  }, [token]);

  const removeSavedWIL = async (opportunityId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/saved-wils/${opportunityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSavedWILs((current) =>
        current.filter(
          (wil) => wil.OpportunityID !== opportunityId
        )
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Could not remove saved opportunity."
      );
    }
  };

  return (
    <div className="page-container">
      <h1>Saved WIL Opportunities</h1>

      <p>
        Opportunities you have saved for later.
      </p>

      {savedWILs.length === 0 ? (
        <div className="dashboard-card">
          <h3>No saved opportunities</h3>
          <p>
            Save opportunities to find them here later.
          </p>
        </div>
      ) : (
        <div className="opportunity-grid">
          {savedWILs.map((wil) => (
            <div
              className="dashboard-card"
              key={wil.SavedWILID}
            >
              <h3>{wil.Title}</h3>

              <p>
                Company: {wil.CompanyName}
              </p>

              <p>
                Location: {wil.Location}
              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  removeSavedWIL(wil.OpportunityID)
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedWILs;