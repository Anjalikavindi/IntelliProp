import React from "react";
import "./AdminLogin.css";

const AdminLogin = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for form submission goes here
    console.log("Login attempt...");
  };

  return (
    <div className="admin-login-container">
      {/* Abstract Shape Background Section */}
      <div className="abstract-background">
        <div className="abstract-content">
          <div className="admin-logo"><img src="/intellipropicon.png" alt="logo" /></div>
          <h1 className="background-welcome-text">Welcome Back</h1>
          <p className="background-slogan">
            Manage properties, users, and auctions efficiently.
          </p>
        </div>

        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
      </div>

      {/* Login Card Section */}
      <div className="admin-login-card">
        <h2 className="admin-login-text">Sign In</h2>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-group">
            <input type="text" id="username" placeholder="Username" required />
            <label htmlFor="username" className="admin-input-label"></label>
          </div>

          <div className="admin-input-group">
            <input
              type="password"
              id="password"
              placeholder="Password"
              required
            />
            <label htmlFor="password" className="admin-input-label"></label>
          </div>

          <div className="admin-forgot-password">
            <a href="/forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="admin-login-button">
            Login
          </button>
        </form>

        <div className="admin-signup-link">
          Don't have an account? <a href="/admin/admin-register">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
