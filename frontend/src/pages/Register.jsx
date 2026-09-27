import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: location.state?.role || (location.state?.from?.pathname?.startsWith("/employer") ? "Employer" : "Student"),
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setIsError(true);
      return;
    }

    if (!termsAccepted) {
      setMessage("Please accept the terms to continue.");
      setIsError(true);
      return;
    }

    try {
      const registrationData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        password: formData.password,
        role: formData.role,
      };

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        registrationData
      );

      setMessage(response.data?.message || "Account created successfully.");
      setIsError(false);

      setTimeout(() => {
        navigate("/login", { state: location.state });
      }, 1000);
    } catch (error) {
      const apiMessage = error.response?.data?.message;
      setMessage(
        (apiMessage === "Database error"
          ? "Registration is temporarily unavailable because the database connection failed. Start MySQL, then try again."
          : apiMessage) ||
        (error.request
          ? `No response from the registration API (${error.code || "network error"}). Check the browser Network panel for the request to localhost:5000.`
          : error.message || "Registration failed.")
      );
      setIsError(true);
    }
  };

  return (
    <main className="auth-page">
      <section className="form-card auth-card">
        <h1>Create {formData.role} Account</h1>
        <p>Join WIL Connect and take your next step.</p>

        {message && <div className={isError ? "error-message" : "message"} role={isError ? "alert" : "status"}>{message}</div>}

        <form onSubmit={handleRegister}>
          <label className="sr-only" htmlFor="register-name">{formData.role === "Employer" ? "Company name" : "Full name"}</label>
          <input
            id="register-name"
            name="fullName"
            placeholder={formData.role === "Employer" ? "Company name" : "Full name"}
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <label className="sr-only" htmlFor="register-email">{formData.role === "Employer" ? "Work email" : "Email address"}</label>
          <input
            id="register-email"
            name="email"
            type="email"
            placeholder={formData.role === "Employer" ? "Work email" : "Email address"}
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label className="sr-only" htmlFor="register-phone">{formData.role === "Employer" ? "Business phone" : "Phone number"}</label>
          <input
            id="register-phone"
            name="phoneNumber"
            type="tel"
            placeholder={formData.role === "Employer" ? "Business phone" : "Phone number"}
            value={formData.phoneNumber}
            onChange={handleChange}
          />

          <label className="sr-only" htmlFor="register-password">Create password</label>
          <input
            id="register-password"
            name="password"
            type="password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label className="sr-only" htmlFor="register-confirm-password">Confirm password</label>
          <input
            id="register-confirm-password"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <label className="sr-only" htmlFor="register-role">Account type</label>
          <select
            id="register-role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="Student">Student</option>
            <option value="Employer">Employer</option>
          </select>

          <label className="auth-check">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
            />
            <span>I agree to the WIL Connect terms and privacy policy.</span>
          </label>

          <button type="submit" className="primary-btn">
            Create Account
          </button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login" state={location.state}>Log in</Link></p>
      </section>
    </main>
  );
}

export default Register;