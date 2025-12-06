import React, { useState, useEffect } from "react";
import "./AdminHeader.css";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";

const AdminHeader = ({ sidebarOpen }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the scroll position is greater than 10 (or any threshold)
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <div
      className={`admin-header ${
        sidebarOpen ? "sidebar-open" : "sidebar-closed"
      } ${scrolled ? "scrolled-header" : ""}`}
    >
      <div className="admin-header-logo">
        <img src="/intellipropicon.png" alt="Logo" />
      </div>


      {/* Right Icons Section */}
      <div className="admin-header-right">
        <div className="admin-header-search">
          <SearchIcon className="admin-search-icon" />
          <input type="text" placeholder="Search here..." />
        </div>

        <div className="admin-header-icon-box">
          <SettingsIcon />
        </div>

        <div className="admin-header-icon-box">
          <NotificationsIcon />
        </div>

        <div className="admin-header-icon-box">
          <PersonIcon />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
