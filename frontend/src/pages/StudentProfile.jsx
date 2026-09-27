import { useEffect, useState } from "react";
import axios from "axios";
import LogoMark from "../components/LogoMark";

function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState(null);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const response = await axios.get(
          "http://localhost:5000/api/student/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 12000,
          }
        );

        if (response.data.profile) {
          setProfile(response.data.profile);
          setDraft(response.data.profile);
        } else {
          setLoadError("The profile response was empty.");
        }
      } catch (error) {
        console.error("Could not load profile", error);
        setLoadError(error.response?.data?.message || "Could not load your profile. Check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token, reloadCount]);

  const handleChange = (e) => {
    setDraft({
      ...draft,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        "http://localhost:5000/api/student/profile",
        {
          studentNumber: draft.StudentNumber,
          institution: draft.Institution,
          qualification: draft.Qualification,
          fieldOfStudy: draft.FieldOfStudy,
          graduationYear: draft.GraduationYear,
          cv: draft.CV,
          academicTranscript: draft.AcademicTranscript,
          skills: draft.Skills,
          bio: draft.Bio,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(draft);
      setMessage("Profile updated successfully.");
      setIsEditing(false);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Could not update profile."
      );
    }
  };

  if (loading) {
    return <div className="page-container profile-page">Loading your profile...</div>;
  }

  if (loadError || !profile) {
    return (
      <div className="page-container profile-page">
        <h1>Student Profile</h1>
        <div className="error-message" role="alert">{loadError || "Your profile could not be found."}</div>
        <button className="primary-btn" type="button" onClick={() => setReloadCount((count) => count + 1)}>Try Again</button>
      </div>
    );
  }

  const initials = profile.FullName?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "S";
  const skills = (profile.Skills || "").split(/[,;\n]/).map((skill) => skill.trim()).filter(Boolean);

  return (
    <div className="page-container profile-page">
      <div className="profile-page-heading">
        <div>
          <span className="eyebrow">Your next opportunity starts with your story</span>
          <h1>{isEditing ? "Edit Profile" : "My Profile"}</h1>
        </div>
        {!isEditing && (
          <button className="primary-btn" type="button" onClick={() => { setDraft(profile); setIsEditing(true); setMessage(""); }}>
            Edit Profile
          </button>
        )}
      </div>

      {message && <div className="message profile-message" role="status">{message}</div>}

      {isEditing ? (
        <form className="profile-edit-form" onSubmit={handleSubmit}>
          <div className="profile-edit-identity">
            <span className="profile-avatar profile-avatar-small">{initials}</span>
            <div><strong>{profile.FullName}</strong><span>{profile.Email}</span></div>
          </div>

          <div className="profile-form-grid">
            <label>Student number<input name="StudentNumber" value={draft.StudentNumber || ""} onChange={handleChange} /></label>
            <label>Institution<input name="Institution" value={draft.Institution || ""} onChange={handleChange} /></label>
            <label>Qualification<input name="Qualification" value={draft.Qualification || ""} onChange={handleChange} /></label>
            <label>Field of study<input name="FieldOfStudy" value={draft.FieldOfStudy || ""} onChange={handleChange} /></label>
            <label>Graduation year<input name="GraduationYear" type="number" value={draft.GraduationYear || ""} onChange={handleChange} /></label>
            <label>CV link<input name="CV" type="url" value={draft.CV || ""} onChange={handleChange} /></label>
            <label>Academic transcript link<input name="AcademicTranscript" type="url" value={draft.AcademicTranscript || ""} onChange={handleChange} /></label>
          </div>
          <p className="profile-form-guidance">A little about your goals, interests, and strengths helps employers understand what you could bring to their team.</p>
          <label className="profile-full-field">About me<textarea name="Bio" value={draft.Bio || ""} onChange={handleChange} rows="4" /></label>
          <label className="profile-full-field">Skills<textarea name="Skills" value={draft.Skills || ""} onChange={handleChange} rows="3" /></label>
          <div className="profile-form-actions">
            <button className="secondary-btn" type="button" onClick={() => { setDraft(profile); setIsEditing(false); setMessage(""); }}>Cancel</button>
            <button className="primary-btn" type="submit">Save Changes</button>
          </div>
        </form>
      ) : (
        <>
          <section className="profile-summary">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-identity">
              <h2>{profile.FullName}</h2>
              <p>{profile.FieldOfStudy || "Student"}{profile.Institution ? ` · ${profile.Institution}` : ""}</p>
              <span>{profile.Email}</span>
            </div>
          </section>

          <div className="profile-content-grid">
            <section className="profile-section">
              <h2>About Me</h2>
              <p>{profile.Bio || "Add a short introduction about yourself and what you are looking to learn."}</p>
              <div className="profile-skills">
                <h3>Skills</h3>
                {skills.length ? skills.map((skill) => <span className="skill-chip" key={skill}>{skill}</span>) : <p className="profile-muted">Add your skills to your profile.</p>}
              </div>
            </section>
            <section className="profile-section">
              <h2>Education</h2>
              <div className="education-entry">
                <span className="education-mark"><LogoMark alt="" /></span>
                <div>
                  <h3>{profile.Qualification || "Qualification not added"}</h3>
                  <p>{profile.Institution || "Institution not added"}</p>
                  <span>{profile.FieldOfStudy || "Field of study not added"}{profile.GraduationYear ? ` · ${profile.GraduationYear}` : ""}</span>
                </div>
              </div>
              <div className="profile-documents">
                {profile.CV && <a href={profile.CV} target="_blank" rel="noreferrer">View CV</a>}
                {profile.AcademicTranscript && <a href={profile.AcademicTranscript} target="_blank" rel="noreferrer">View transcript</a>}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default StudentProfile;