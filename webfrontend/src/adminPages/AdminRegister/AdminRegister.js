import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import withReactContent from "sweetalert2-react-content";
import "../AdminLogin/AdminLogin.css";
import "./AdminRegister.css";

const MySwal = withReactContent(Swal);

// Utility function for basic email validation
const validateEmail = (email) => {
  // Basic regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const AdminRegister = () => {
  const [roles, setRoles] = useState([]);

  // Fetch admin roles from backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/auth/roles"
        );
        setRoles(res.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
        MySwal.fire({
          icon: "error",
          title: "Role Fetch Failed",
          text: "Could not fetch admin roles from the server.",
        });
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const full_name = document.getElementById("fullname").value;
    const role = document.getElementById("role").value;
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // 1. All fields are required
    if (
      !full_name ||
      !email ||
      !role ||
      !username ||
      !password ||
      !confirmPassword
    ) {
      MySwal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "All fields are required.",
        confirmButtonColor: "#ab9272",
      });
      return;
    }

    // 2. Email address must be validated correctly
    if (!validateEmail(email)) {
      MySwal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter a valid email address.",
        confirmButtonColor: "#ab9272",
      });
      return;
    }

    // 3. Password must have at least 8 characters
    if (password.length < 8) {
      MySwal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Password must be at least 8 characters long.",
        confirmButtonColor: "#ab9272",
      });
      return;
    }

    // 4. Confirm password must be same as the password
    if (password !== confirmPassword) {
      MySwal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Password and Confirm Password must match.",
        confirmButtonColor: "#ab9272",
      });
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/admin/auth/admin-register", {
        full_name,
        email,
        role,
        username,
        password,
      });

      // 5. Upon successful submission, display a success sweetalert and redirect
      MySwal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Admin user has been registered.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        // Redirect to login page
        window.location.href = "/admin/dashboard";
      });
    } catch (error) {
      console.error("Registration error:", error);
      // 6. If there's an error, display an error sweetalert
      const errorMessage =
        error.response?.data?.message ||
        "An unexpected error occurred during registration.";

      MySwal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorMessage,
        confirmButtonColor: "#ab9272",
      });
    }
  };

  return (
    <div className="admin-login-container admin-register-bg">
      {/* Abstract Shape Background Section (Identical to AdminLogin) */}
      <div className="abstract-background admin-abstract">
        <div className="abstract-content">
          <div className="admin-logo">
            <img src="/intellipropicon.png" alt="logo" />
          </div>
          <h1 className="background-join-text">Join the Panel</h1>
          <p className="background-slogan">
            Start managing properties and users across the platform.
          </p>
        </div>

        {/* Abstract Shapes (Remain the same) */}
        <div className="shape shape-1 register-shape"></div>
        <div className="shape shape-2 register-shape"></div>
        <div className="shape shape-3 register-shape"></div>
        <div className="shape shape-4 register-shape"></div>
        <div className="shape shape-5 register-shape"></div>
      </div>

      {/* Register Card Section */}
      <div className="admin-login-card">
        <h2 className="admin-login-text">Create Account</h2>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-group">
            <input type="text" id="fullname" placeholder="Full Name" />
            <label htmlFor="fullname" className="admin-input-label"></label>
          </div>
          <div className="admin-input-group">
            <input type="email" id="email" placeholder="Email Address" />
            <label htmlFor="email" className="admin-input-label"></label>
          </div>
          <div className="admin-input-row">
            <div className="admin-input-group admin-row-field">
              <select id="role">
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.role_name}
                  </option>
                ))}
              </select>
              <label htmlFor="role" className="admin-input-label"></label>
            </div>

            <div className="admin-input-group admin-row-field">
              <input type="text" id="username" placeholder="Username" />
              <label htmlFor="username" className="admin-input-label"></label>
            </div>
          </div>
          <div className="admin-input-row">
            <div className="admin-input-group admin-row-field">
              <input type="password" id="password" placeholder="Password" />
              <label htmlFor="password" className="admin-input-label"></label>
            </div>
            <div className="admin-input-group admin-row-field">
              <input
                type="password"
                id="confirm-password"
                placeholder="Confirm Password"
              />
              <label
                htmlFor="confirm-password"
                className="admin-input-label"
              ></label>
            </div>
          </div>
          <button type="submit" className="admin-register-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
