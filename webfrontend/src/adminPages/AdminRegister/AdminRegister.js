import React from "react";
import '../AdminLogin/AdminLogin.css';

const AdminRegister = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for form submission (admin registration) goes here
    console.log("Admin registration attempt...");
  };

  return (
    <div className="admin-login-container">
      {/* Abstract Shape Background Section (Identical to AdminLogin) */}
      <div className="abstract-background">
        <div className="abstract-content">
          <div className="admin-logo">
            <img src="/intellipropicon.png" alt="logo" />
          </div>
          <h1 className="background-welcome-text">Join the Panel</h1>
          <p className="background-slogan">
            Start managing properties and users across the platform.
          </p>
        </div>

        {/* Abstract Shapes (Remain the same) */}
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
      </div>

      {/* Register Card Section */}
      <div className="admin-login-card">
        <h2 className="admin-login-text">Create Account</h2>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {/* Full Name Input */}
          <div className="admin-input-group">
            <input type="text" id="fullname" placeholder="Full Name" required />
            <label htmlFor="fullname" className="admin-input-label"></label>
          </div>

          {/* Email Input */}
          <div className="admin-input-group">
            <input
              type="email"
              id="email"
              placeholder="Email Address"
              required
            />
            <label htmlFor="email" className="admin-input-label"></label>
          </div>

          {/* Username Input */}
          <div className="admin-input-group">
            <input type="text" id="username" placeholder="Username" required />
            <label htmlFor="username" className="admin-input-label"></label>
          </div>

          {/* Password Input */}
          <div className="admin-input-group">
            <input
              type="password"
              id="password"
              placeholder="Password"
              required
            />
            <label htmlFor="password" className="admin-input-label"></label>
          </div>

          {/* Confirm Password Input */}
          <div className="admin-input-group">
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm Password"
              required
            />
            <label
              htmlFor="confirm-password"
              className="admin-input-label"
            ></label>
          </div>

          <button type="submit" className="admin-login-button">
            Register
          </button>
        </form>

        <div className="admin-signup-link">
          Already have an account? <a href="/admin/login">Sign In</a>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
