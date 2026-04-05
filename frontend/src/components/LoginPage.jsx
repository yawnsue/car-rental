import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import logo from "../assets/black-rock-logo.png";

function LoginPage({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = "http://localhost:5001/api/users";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

   /* 
      TEMP. FRONT END LOGIN
      I bypassed backend authentication so I can properly develop the UI
      and ensure it works appropriately.

      BACKEND / AUTHENTICATION:
        - login/signup API request.
        - credential validation.
        - token handling.
        - redirect logic.
    */

    try {
      const endpoint = isSignUp ? `${API_URL}/register` : `${API_URL}/login`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      // Store token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/browse");
    } catch (err) {
      setError("Unable to connect to server.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <section className="login-brand">
          <div className="brand-top">
            <div className="brand-badge brand-badge-logo">
              <img src={logo} alt="Black Rock Solutions logo" className="brand-logo" />
            </div>
          </div>

          <div className="brand-content">
            <div className="gold-line"></div>
            <h1 className="brand-title">Ride in Style. Book with Confidence.</h1>
            <p className="brand-text">
              Black Rock Solutions delivers a premium rental experience right here 
              in Central Florida. Stop by for dependable vehicle access for every 
              kind of driver.
            </p>

            
          </div>
        </section>

        <section className="login-panel">
          <div className="login-card">
            <p className="login-eyebrow">
              {isSignUp ? "Create account" : "Member access"}
            </p>

            <h2 className="login-title">
              {isSignUp ? "Sign up" : "Welcome back"}
            </h2>

            <p className="login-subtitle">
              {isSignUp
                ? "Create your Black Rock Solutions account to start booking vehicles."
                : "Sign in to manage rentals, view vehicles, and access your dashboard."}
            </p>

            {error && <div className="login-error">{error}</div>}

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field-group">
                <label className="label" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  className="input-field"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="login-field-group">
                <label className="label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  className="input-field"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="login-actions">
                <button type="submit" className="btn btn-primary">
                  {isSignUp ? "Create Account" : "Login"}
                </button>
              </div>
            </form>

            <p className="login-switch-text">
              {isSignUp ? "Already have an account?" : "Need an account?"}
              <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Switch to Login" : "Switch to Sign Up"}
              </button>
            </p>

            <p className="form-note">
              Designed for a premium booking experience with a modern automotive
              look and feel.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;
