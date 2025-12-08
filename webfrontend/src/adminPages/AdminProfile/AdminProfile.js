import React from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaCalendarAlt,
} from "react-icons/fa";
import "./AdminProfile.css";

const mockUserProfile = {
  id: 101,
  name: "Anjalika Dikkumbura",
  email: "anjalikavindy@gmail.com",
  mobile: "+94 77 123 4567",
  role: "Admin/Advertiser", // User's role on the platform
  createdAt: "2024-10-15",
  isVerified: true,
};

const AdminProfile = () => {
  const user = mockUserProfile;

  return (
    <div className="dashboard-wrapper">
      <div className="admin-dashboard-content padding-top">
        <div className="profile-card-container">
          <div className="profile-card">
            <div className="profile-header">
              <FaUserCircle className="profile-avatar-icon" />
              <h3>{user.name}</h3>
              <span
                className={`profile-status status-${
                  user.isVerified ? "verified" : "pending"
                }`}
              >
                {user.isVerified ? "Account Verified" : "Verification Pending"}
              </span>
            </div>
            <div className="profile-details">
              <div className="detail-row-group">
                <div className="detail-item">
                  <FaEnvelope className="admin-detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">Email Address</span>
                    <span className="detail-value">{user.email}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <FaPhone className="admin-detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">Contact Number</span>
                    <span className="detail-value">{user.mobile}</span>
                  </div>
                </div>
              </div>
              {/* Row 2: Role and Member Since */}
              <div className="detail-row-group">
                <div className="detail-item">
                  <FaBriefcase className="admin-detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">Role on Platform</span>
                    <span className="detail-value">{user.role}</span>
                  </div>
                </div>
                <div className="detail-item read-only">
                  <FaCalendarAlt className="admin-detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">Member Since</span>
                    <span className="detail-value">{user.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-actions">
              <button className="edit-btn">Edit Profile</button>
              <button className="change-password-btn">Change Password</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
