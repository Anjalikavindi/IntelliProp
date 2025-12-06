import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import GetStarted from "../../components/GetStarted/GetStarted";
import Footer from "../../components/Footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Verify.css";
import "../PostAds/PostAds.css";
import axios from "axios";

const Verify = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // Load user details from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");

    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const token = localStorage.getItem("token");

  const handleSendOTP = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/otp/send",
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "OTP Sent",
        text: "Please check your email for the OTP.",
        confirmButtonColor: "#ab9272",
      }).then(() => promptOTP()); // Open OTP prompt after sending
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to send OTP.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const promptOTP = () => {
    Swal.fire({
      title: "Enter OTP",
      input: "text",
      inputLabel: "OTP",
      inputPlaceholder: "Enter the 6-digit OTP",
      showCancelButton: true,
      confirmButtonColor: "#000000", 
      cancelButtonColor: "#ab9272",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const otp = result.value;
        if (!otp) {
          Swal.fire({ icon: "warning", title: "Please enter OTP" });
          return;
        }

        try {
          await axios.post(
            "http://localhost:5000/api/otp/verify",
            { email, otp },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          Swal.fire({
            icon: "success",
            title: "Email Verified",
            text: "You can now proceed to post your ad.",
            confirmButtonColor: "#ab9272",
          }).then(() => {
            navigate("/postyourad"); // <-- Redirection to postyourad
          });
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Invalid OTP",
            text: err.response?.data?.message || "OTP verification failed.",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
  };


  return (
    <>
      <Header />
      {/* Breadcrumb */}
      <div
        className="breadcrumb-section"
        style={{ backgroundImage: `url('/ads-bg.jpg')` }}
      >
        <div className="breadcrumb-content">
          <h2>Verify</h2>
          <p>
            <Link to="/" className="breadcrumb-link">
              Home
            </Link>{" "}
            / Verify
          </p>
        </div>
      </div>

      <div className="ad-content blue-bg">
        <div className="ads-container innerWidth paddings">
          <div className="process-header">
            <h1 className="process-title">Verify Your Email</h1>
            <p className="ads-subtext process-subtext">
              Easily showcase your product or service to a wide audience. Upload
              photos, videos, and detailed descriptions to create an engaging
              listing. With our user-friendly platform, posting is quick and
              simple.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="progress-wrapper">
            <div className="steps">
              <div className="step active">
                <span>
                  <img
                    src="/icons/verify.png"
                    alt="Verify Icon"
                    className="ads-icon"
                  />
                </span>
                <p className="process-subtext">Verify</p>
              </div>
              <div className="line"></div>
              <div className="step">
                <span>
                  <img
                    src="/icons/add-post.png"
                    alt="Verify Icon"
                    className="detail-icon ads-icon"
                  />
                </span>
                <p className="process-subtext">Ad Detail</p>
              </div>
            </div>
          </div>

          <div className="postads-layout">
            {/* RIGHT SECTION - CONTACT INFO */}
            <div className="verify-section">
              <div className="contact-box">
                {/* <h3>Contact Information</h3> */}

                <div className="form-group">
                  <label>Name</label>
                  <input type="text" value={name} readOnly />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={email} readOnly/>
                </div>

                <button className="button-2 verify-btn" onClick={handleSendOTP}>
                  Send OTP
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
      <GetStarted />
      <Footer />
    </>
  )
}

export default Verify
