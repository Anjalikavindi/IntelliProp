import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./AdminLogin.css";

const MySwal = withReactContent(Swal);

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = formData;

    // --- Client-Side Validations (SweetAlert2) ---
    if (!username.trim() || !password.trim()) {
      MySwal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Username and Password are required.",
        confirmButtonColor: "#ab9272",
      });
      return;
    }

    try {
      // 1. Send Login Request
      const res = await axios.post(
        "http://localhost:5000/api/admin/auth/admin-login", // New Login Endpoint
        {
          username: username.trim(),
          password,
        }
      );

      // Store token (e.g., in localStorage)
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUser", JSON.stringify(res.data.admin));

      // 2. Successful submission: Display success SweetAlert and redirect
      MySwal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Redirecting to Dashboard...",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        // Redirect to dashboard page
        window.location.href = "/admin/dashboard";
      });
    } catch (error) {
      console.error("Login error:", error.response?.data || error);

      // 3. Error: Display error SweetAlert
      const errorMessage =
        error.response?.data?.message ||
        "An unexpected error occurred during login.";

      MySwal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
        confirmButtonColor: "#ab9272",
      });
    }
  };

  return (
    <div className="admin-login-container">
      {/* Abstract Shape Background Section */}
      <div className="abstract-background">
        <div className="abstract-content">
          <div className="admin-logo">
            <img src="/intellipropicon.png" alt="logo" />
          </div>
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
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <label htmlFor="username" className="admin-input-label"></label>
          </div>

          <div className="admin-input-group">
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
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

        {/* <div className="admin-signup-link">
          Don't have an account? <a href="/admin/admin-register">Sign Up</a>
        </div> */}
      </div>
    </div>
  );
};

export default AdminLogin;
