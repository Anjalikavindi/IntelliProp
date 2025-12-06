import React, {useState} from "react";
import "./Sidebar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TableViewIcon from "@mui/icons-material/TableView";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import MenuIcon from "@mui/icons-material/Menu";

const Sidebar = ({ open, setOpen }) => {
  const [active, setActive] = useState("Dashboard");

  
  const user = {
    name: "Anjalika Dikkumbura",
    avatar: "https://i.pravatar.cc/150?img=47", 
  };

  const menuItems = [
    { name: "Dashboard", icon: <DashboardIcon /> },
    { name: "Lands", icon: <TableViewIcon /> },
    { name: "Residencies", icon: <CreditCardIcon /> },
    { name: "Notifications", icon: <NotificationsIcon /> },
    { name: "Profile", icon: <PersonIcon /> },
    { name: "Sign In", icon: <LoginIcon /> },
    { name: "Sign Up", icon: <HowToRegIcon /> },
  ];

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
            onClick={() => setActive(item.name)}
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
