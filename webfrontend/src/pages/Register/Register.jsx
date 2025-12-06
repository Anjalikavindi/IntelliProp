import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Register.css";
import axios from "axios";
import Swal from "sweetalert2";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // -------------------------
    //  VALIDATIONS USING SweetAlert
    // -------------------------

    if (!form.name.trim()) {
      return Swal.fire({
        title: "Missing Field",
        text: "Please enter your name.",
        icon: "warning",
        confirmButtonColor: "#ab9272",
      });
    }

    // Email required
    if (!form.email.trim()) {
      return Swal.fire({
        title: "Missing Field",
        text: "Please enter your email.",
        icon: "warning",
        confirmButtonColor: "#ab9272",
      });
    }

    // Email format validation (basic & reliable)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email)) {
      return Swal.fire({
        title: "Invalid Email",
        text: "Please enter a valid email address (example: user@example.com).",
        icon: "error",
        confirmButtonColor: "#ab9272",
      });
    }

    // Validate mobile number length: Only 9 digits after +94
    if (!/^\d{9}$/.test(form.mobile)) {
      return Swal.fire({
        title: "Invalid Mobile Number",
        text: "Mobile number must contain exactly 9 digits.",
        icon: "error",
        confirmButtonColor: "#ab9272",
      });
    }

    if (!form.city.trim()) {
      return Swal.fire({
        title: "Missing Field",
        text: "Please select your city.",
        icon: "warning",
        confirmButtonColor: "#ab9272",
      });
    }

    if (!form.password.trim()) {
      return Swal.fire({
        title: "Missing Field",
        text: "Please enter a password.",
        icon: "warning",
        confirmButtonColor: "#ab9272",
      });
    }

    if (form.password.length < 8) {
      return Swal.fire({
        title: "Weak Password",
        text: "Password must be at least 8 characters long.",
        icon: "error",
        confirmButtonColor: "#ab9272",
      });
    }

    if (form.password !== form.confirmPassword) {
      return Swal.fire({
        title: "Password Mismatch",
        text: "Password and Confirm Password do not match.",
        icon: "error",
        confirmButtonColor: "#ab9272",
      });
    }

    // -------------------------
    //   SEND TO BACKEND
    // -------------------------
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Redirecting to login...",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "/login";
      });
    } catch (err) {
      Swal.fire({
        title: "Registration Failed",
        text: err.response?.data?.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <>
      <Header />
      {/* Registration Form Section */}
      <div className="register-wrapper blue-bg">
        <div className="register-container innerWidth paddings">
          {/* ⭐ New Process Section */}
          <div className="process-wrapper">
            <div className="process-container">
              <div className="process-header">
                <h2 className="process-title">Learn More About Process</h2>
                <p className="process-subtext">
                  Was are delightful solitude discovered collecting man day.
                  Resolving neglected sir tolerably.
                </p>
              </div>

              <div className="process-steps">
                {/* Step 1 */}
                <div className="process-step">
                  <div className="step-icon">
                    <img
                      src="/icons/register.png"
                      alt="Register"
                      className="step-img"
                    />
                  </div>
                  <h3>Register</h3>
                  <p>
                    Quickly create your account by entering basic details and
                    getting started.
                  </p>
                </div>

                <div className="dotted-line"></div>

                {/* Step 2 */}
                <div className="process-step">
                  <div className="step-icon">
                    <img
                      src="/icons/verify.png"
                      alt="Verify"
                      className="step-img"
                    />
                  </div>
                  <h3>Verify Account</h3>
                  <p>
                    Confirm your email or mobile number to activate your account
                    securely.
                  </p>
                </div>

                <div className="dotted-line"></div>

                {/* Step 3 */}
                <div className="process-step">
                  <div className="step-icon">
                    <img
                      src="/icons/add-post.png"
                      alt="Post Ad"
                      className="step-img post"
                    />
                  </div>
                  <h3>Post Your Ad</h3>
                  <p>
                    Once verified, instantly post your ad and start gaining
                    visibility.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group half">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="form-group half">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              {/* Mobile - with +94 prefix */}
              <div className="form-group half">
                <label>Mobile Number</label>
                <div className="mobile-wrapper">
                  <span className="country-code">+94</span>
                  <input
                    type="text"
                    className="mobile-number"
                    placeholder="Enter mobile number"
                    value={form.mobile}
                    maxLength={9}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setForm({ ...form, mobile: value });
                      }
                    }}
                  />
                </div>
              </div>

              {/* City dropdown */}
              <div className="form-group half">
                <label>City</label>
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                >
                  <option value="">Select a city</option>
                  <option value="Colombo">Colombo</option>
                  <option value="Galle">Galle</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Jaffna">Jaffna</option>
                  <option value="Negombo">Negombo</option>
                  <option value="Matara">Matara</option>
                  <option value="Kurunegala">Kurunegala</option>
                  <option value="Gampaha">Gampaha</option>
                  <option value="Anuradhapura">Anuradhapura</option>
                  <option value="Batticaloa">Batticaloa</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>

              <div className="form-group half">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-row">
              <p className="subtext">
                Password must be at least 8 characters long. We recommend using
                a mix of letters, numbers, and symbols for stronger security.
              </p>
            </div>

            <button type="submit" className="button register-btn">
              Register
            </button>

            <p className="login-redirect">
              Already have an account? <a href="/login">Log in</a>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
