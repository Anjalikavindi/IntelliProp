import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import LandscapeIcon from '@mui/icons-material/Landscape';
import RealEstateAgentIcon from '@mui/icons-material/RealEstateAgent';
import PaidIcon from '@mui/icons-material/Paid';
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import MenuIcon from "@mui/icons-material/Menu";
import { logoutAdmin } from "../../utils/authUtils";

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState("Dashboard");
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setAdminName(parsedUser.full_name || "Admin");
    }
  }, []);
  
  const menuItems = [
    { name: "Dashboard", icon: <SpaceDashboardIcon />, path: "/admin/dashboard" },
    { name: "Residencies", icon: <RealEstateAgentIcon />, path: "/admin/residencies-ads" },
    { name: "Lands", icon: <LandscapeIcon />, path: "/admin/land-ads" },
    { name: "Auctions", icon: <PaidIcon />, path: "/admin/land-auctions" },
    { name: "Registered Users", icon: <HowToRegIcon />, path: "/admin/registered-users" },
    { name: "Manage Admins", icon: <HowToRegIcon />, path: "/admin/manage-admins" },
    { name: "Profile", icon: <PersonIcon />, path: "/admin/admin-profile" },
    { name: "Logout", icon: <LogoutIcon />, path: null },
  ];

  const handleMenuClick = (item) => {
    // Check if the clicked item is Logout
    if (item.name === "Logout") {
      logoutAdmin("You have successfully logged out."); 
      return; // Stop further execution
    }

    setActive(item.name);
    if (item.path) {
      navigate(item.path);
    }
    if (setOpen) {
      setOpen(false);
    }
  };

  return (
    <>
    {/* Mobile Toggle Button */}
      <button className={`sidebar-toggle-btn ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
        <MenuIcon />
      </button>

    <div className={`admin-sidebar ${open ? "open" : ""}`}>
      <div className="admin-user-section vertical">
        <img
          src="https://i.pravatar.cc/150?img=5"
          alt="User"
          className="admin-user-avatar"
        />
        <div>
          <h6 className="admin-greeting">Hello,</h6>
          <h3 className="admin-user-name">{adminName}</h3>
        </div>
      </div>

      <ul className="admin-sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={active === item.name ? "active" : ""}
            onClick={() => handleMenuClick(item)}
          >
            <span className="admin-icon">{item.icon}</span>
            <span className="admin-label">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};

export default Sidebar;
