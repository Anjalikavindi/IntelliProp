import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TableViewIcon from "@mui/icons-material/TableView";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import MenuIcon from "@mui/icons-material/Menu";

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState("Dashboard");

  
  const user = {
    name: "Anjalika Dikkumbura",
    avatar: "https://i.pravatar.cc/150?img=5", 
  };

  const menuItems = [
    { name: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { name: "Residencies", icon: <CreditCardIcon />, path: "/admin/residencies-ads" },
    { name: "Lands", icon: <TableViewIcon />, path: "/admin/land-ads" },
    { name: "Auctions", icon: <NotificationsIcon />, path: "/admin/land-auctions" },
    { name: "Registered Users", icon: <HowToRegIcon />, path: "/register" },
    { name: "Profile", icon: <PersonIcon />, path: "/admin/profile" },
    { name: "Logout", icon: <LogoutIcon />, path: "/login" },
  ];

  const handleMenuClick = (item) => {
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
          src={user.avatar}
          alt="User"
          className="admin-user-avatar"
        />
        <div>
          <h7 className="admin-greeting">Hello,</h7>
          <h3 className="admin-user-name">{user.name}</h3>
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
