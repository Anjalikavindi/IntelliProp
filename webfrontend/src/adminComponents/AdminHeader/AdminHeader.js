import React from "react";
import "./AdminHeader.css";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";

const AdminHeader = ({ sidebarOpen }) => {
  return (
    <div
      className={`admin-header ${
        sidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      {/* Search Section */}
      {/* <div className="admin-header-search">
        <SearchIcon className="admin-search-icon" />
        <input type="text" placeholder="Search here..." />
      </div> */}
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
