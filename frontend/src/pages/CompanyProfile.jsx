import { useEffect, useState } from "react";
import axios from "axios";
import LogoMark from "../components/LogoMark";

function CompanyProfile() {
  const [profile, setProfile] = useState({
    CompanyName: "",
    LogoURL: "",
    Industry: "",
    Website: "",
    Location: "",
    Description: "",
  });

  const [message, setMessage] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!logoFile) {
      setLogoPreview("");
      return undefined;
    }

    const previewURL = URL.createObjectURL(logoFile);
    setLogoPreview(previewURL);
    return () => URL.revokeObjectURL(previewURL);
  }, [logoFile]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/company/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(response.data.profile || {});
      } catch (error) {
        console.error("Could not load company profile", error);
      }
    };

    loadProfile();
  }, [token]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        "http://localhost:5000/api/company/profile",
        {
          companyName: profile.CompanyName,
          industry: profile.Industry,
          website: profile.Website,
          location: profile.Location,
          description: profile.Description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Company profile updated successfully.");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Could not update company profile."
      );
    }
  };

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!/(image\/jpeg|image\/png|image\/webp)/.test(file.type)) {
      setMessage("Choose a JPG, PNG, or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setMessage("Company images must be 3 MB or smaller.");
      event.target.value = "";
      return;
    }

    setMessage("");
    setLogoFile(file);
  };

  const uploadLogo = async () => {
    if (!logoFile) return;

    const formData = new FormData();
    formData.append("logo", logoFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/company/profile/logo",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 20000,
        }
      );

      setProfile((current) => ({ ...current, LogoURL: response.data.logoURL }));
      setLogoFile(null);
      setMessage("Company logo updated successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not upload company logo.");
    }
  };

  const currentLogo = logoPreview || (profile.LogoURL ? `http://localhost:5000${profile.LogoURL}` : "");

  return (
    <div className="page-container">
      <span className="eyebrow">Your company story</span>
      <h1>Company Profile</h1>
      <p>Help students picture themselves working with you. Share what your team does, where you are, and what makes your workplace worth discovering.</p>

      <div className="form-card company-profile-form">
        {message && (
          <div className="message">{message}</div>
        )}

        <form onSubmit={handleSubmit}>
          <section className="company-logo-editor" aria-label="Company logo">
            <div className="company-logo-preview">
              {currentLogo ? <img src={currentLogo} alt="Company logo preview" /> : <LogoMark alt="" />}
            </div>
            <div className="company-logo-controls">
              <strong>Company logo</strong>
              <p>Add a clear image so students can recognize your company.</p>
              <div className="company-logo-actions">
                <label className="secondary-btn company-file-button">
                  Choose image
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleLogoChange} />
                </label>
                <button className="primary-btn" type="button" disabled={!logoFile} onClick={uploadLogo}>
                  Upload logo
                </button>
              </div>
              <small>JPG, PNG, or WEBP. Maximum 3 MB.</small>
            </div>
          </section>

          <input
            name="CompanyName"
            placeholder="Company Name"
            value={profile.CompanyName || ""}
            onChange={handleChange}
            required
          />

          <input
            name="Industry"
            placeholder="Industry"
            value={profile.Industry || ""}
            onChange={handleChange}
          />

          <input
            name="Website"
            placeholder="Website"
            value={profile.Website || ""}
            onChange={handleChange}
          />

          <input
            name="Location"
            placeholder="Location"
            value={profile.Location || ""}
            onChange={handleChange}
          />

          <textarea
            name="Description"
            placeholder="Company Description"
            value={profile.Description || ""}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="primary-btn"
          >
            Save Company Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompanyProfile;