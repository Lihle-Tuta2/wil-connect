import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      const role = response.data.user.role;

      if (role === "Student") {
        navigate("/student/dashboard", { replace: true });
      } else if (role === "Employer") {
        navigate("/employer/dashboard", { replace: true });
      } else if (role === "Admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setMessage("This account does not have an enabled WIL Connect role.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        (error.request
          ? "WIL Connect could not reach the server. Please try again when the service is available."
          : "Login failed. Please try again.")
      );
    }
  };

  return (
    <main className="auth-page">
      <section className="form-card auth-card">
        <h1>Welcome Back!</h1>
        <p>Sign in to continue to your WIL Connect account.</p>

        {message && <div className="error-message">{message}</div>}

        <form onSubmit={handleLogin}>
          <label className="sr-only" htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="sr-only" htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="primary-btn">
            Login
          </button>
        </form>

        <div className="auth-meta">
          <span className="unavailable-link" title="Password recovery is not available yet">Forgot password?</span>
          <span>New to WIL Connect? <Link to="/register" state={location.state}>Register</Link></span>
        </div>
        <p className="admin-login-note">Administrator? Use this same form with your admin-provisioned account. Admin accounts are created by the WIL Connect administrator.</p>
        <div className="auth-divider">OR</div>
        <p className="auth-availability">Social sign-in is not available yet.</p>
      </section>
    </main>
  );
}

export default Login;