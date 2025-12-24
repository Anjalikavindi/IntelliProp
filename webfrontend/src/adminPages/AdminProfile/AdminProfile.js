import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUserCircle,
  FaEnvelope,
  FaUser,
  FaBriefcase,
  FaCalendarAlt,
} from "react-icons/fa";
import "./AdminProfile.css";

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Retrieve the admin info stored during login
        const storedAdmin = JSON.parse(localStorage.getItem("adminUser"));
        
        if (storedAdmin && storedAdmin.id) {
          const response = await axios.get(`http://localhost:5000/api/admin/auth/profile/${storedAdmin.id}`);
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="loader">Loading Profile...</div>;
  if (!user) return <div className="error">User session not found. Please log in again.</div>;

  return (
    <div className="dashboard-wrapper">
      <div className="admin-dashboard-content padding-top">
        <div className="profile-card-container">
          <div className="profile-card">
            <div className="profile-header">
              <FaUserCircle className="profile-avatar-icon" />
              <h3>{user.username}</h3>
              <span className="profile-status status-verified">
                Account Active
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
                  <FaUser className="admin-detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">Full Name</span>
                    <span className="detail-value">{user.name}</span>
                  </div>
                </div>
              </div>
              {/* Row 2: Role and Member Since */}
              <div className="detail-row-group">
                <div className="detail-item">
                  <FaBriefcase className="admin-detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">Role</span>
                    <span className="detail-value">{user.role}</span>
                  </div>
                </div>
                <div className="detail-item read-only">
                  <FaCalendarAlt className="admin-detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">Member Since</span>
                    <span className="detail-value">
                      {new Date(user.created_at).toLocaleDateString('en-GB', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </span>
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
