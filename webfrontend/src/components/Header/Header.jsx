import React, { useState, useEffect } from "react";
import "./Header.css";
import { BiMenuAltRight, BiChevronDown } from "react-icons/bi";
import { getMenuStyles } from "../../utils/common";
import useHeaderColor from "../../hooks/useHeaderColor";
import OutsideClickHandler from "react-outside-click-handler";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [userName, setUserName] = useState(null); // Store user's name
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const headerColor = useHeaderColor();

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem("token"); // Or "accessToken" depending on your login
    const name = localStorage.getItem("userName"); // Save user's name when they log in
    if (token && name) {
      setUserName(name);
    } else {
      setUserName(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setUserName(null);
    setDropdownOpen(false);
    window.location.href = "/"; // Redirect to home
  };

  const handlePostYourAd = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // User is logged out, redirect to register
      navigate("/register");
      return;
    }

    try {
      // Fetch logged-in user's data
      const response = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = response.data;

      if (Number(user.is_email_verified) === 1) {
        navigate("/postyourad"); // Email verified
      } else {
        navigate("/verifyyournumber"); // Email not verified
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      navigate("/register"); // fallback if error occurs
    }
  };


  return (
    <section className="h-wrapper" style={{ background: headerColor }}>
      <div className="flexCenter innerWidth paddings h-container">
        {/* logo */}
        <Link to="/">
          <img
            src="./intellipropicon.png"
            alt="logo"
            width={190}
            className="logo-click"
          />
        </Link>
        {/* menu */}
        <OutsideClickHandler
          onOutsideClick={() => {
            setMenuOpened(false);
            setDropdownOpen(false);
          }}
        >
          <div
            // ref={menuRef}
            className="flexCenter h-menu"
            style={getMenuStyles(menuOpened)}
          >
            <Link to="/houses">Residencies</Link>
            <Link to="/lands">Lands</Link>
            <Link to="/contactus">Contact Us</Link>
            {userName ? (
              <div className="profile-dropdown">
                <button
                  className="profile-button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  {userName} <BiChevronDown size={20} />
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                      Dashboard
                    </Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="profile-dropdown">
                <button
                  className="profile-button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  Get Started <BiChevronDown size={20} />
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/login" onClick={() => setDropdownOpen(false)}>
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setDropdownOpen(false)}>
                      Register
                    </Link>
                  </div>
                )}
              </div>
            )}
            <button className="button" onClick={handlePostYourAd}>
              Post Your Ad
            </button>
          </div>
        </OutsideClickHandler>

        {/* for medium and small screens */}
        <div
          className="menu-icon"
          onClick={() => setMenuOpened((prev) => !prev)}
        >
          <BiMenuAltRight size={30} />
        </div>
      </div>
    </section>
  );
};

export default Header;
