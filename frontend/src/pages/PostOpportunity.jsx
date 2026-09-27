import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PostOpportunity() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fieldOfStudy: "",
    employmentType: "",
    location: "",
    closingDate: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/opportunities",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        "WIL opportunity posted successfully."
      );

      setFormData({
        title: "",
        description: "",
        fieldOfStudy: "",
        employmentType: "",
        location: "",
        closingDate: "",
      });

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Could not post opportunity."
      );
    }
  };

  return (
    <div className="page-container">
      <h1>Post WIL Opportunity</h1>

      <p>
        Create a new Work Integrated Learning
        opportunity for students.
      </p>

      <div className="form-card">
        {message && (
          <div className="message">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Opportunity Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Opportunity Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <input
            name="fieldOfStudy"
            placeholder="Field of Study"
            value={formData.fieldOfStudy}
            onChange={handleChange}
            required
          />

          <input
            name="employmentType"
            placeholder="Employment Type"
            value={formData.employmentType}
            onChange={handleChange}
            required
          />

          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <label>
            Closing Date
          </label>

          <input
            name="closingDate"
            type="date"
            value={formData.closingDate}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="primary-btn"
          >
            Post Opportunity
          </button>

          <button
            type="button"
            className="primary-btn"
            onClick={() =>
              navigate("/employer/opportunities")
            }
          >
            View My Opportunities
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostOpportunity;