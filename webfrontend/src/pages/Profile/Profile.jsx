import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import GetStarted from "../../components/GetStarted/GetStarted";
import Footer from "../../components/Footer/Footer";
import "./Profile.css";
import axios from "axios";
import Swal from "sweetalert2";

const dummyFavorites = [
  {
    id: 1,
    title: "Residential Land for Sale in Homagama",
    price: "2,500,000",
    date: "2025-10-13",
    location: "Homagama",
    image: "./l1.jpg",
  },
  {
    id: 2,
    title: "Residential Land for Sale in Kadawatha",
    price: "1,100,000",
    date: "2025-11-07",
    location: "Kadawatha",
    image: "./l2.jpg",
  },
  {
    id: 3,
    title: "Agricultural Land for Sale in Eratna",
    price: "9,000,000",
    date: "2025-11-21",
    location: "Eratna",
    image: "./r3.png",
  },
  {
    id: 1,
    title: "Residential Land for Sale in Homagama",
    price: "2,500,000",
    date: "2025-10-13",
    location: "Homagama",
    image: "./l1.jpg",
  },
  {
    id: 2,
    title: "Residential Land for Sale in Kadawatha",
    price: "1,100,000",
    date: "2025-11-07",
    location: "Kadawatha",
    image: "./l2.jpg",
  },
  {
    id: 3,
    title: "Agricultural Land for Sale in Eratna",
    price: "9,000,000",
    date: "2025-11-21",
    location: "Eratna",
    image: "./r3.png",
  },
];

const dummyAds = [
  {
    id: 101,
    title: "House for Sale in Colombo",
    price: "15,500,000",
    date: "2025-11-02",
    location: "Colombo",
    category: "House",
    image: "./r1.png",
  },
  {
    id: 102,
    title: "Residential Land for Sale in Kandy",
    price: "3,200,000",
    date: "2025-10-12",
    location: "Kandy",
    category: "Land",
    image: "./l1.jpg",
  },
  {
    id: 103,
    title: "House for Sale in Galle",
    price: "12,800,000",
    date: "2025-09-21",
    location: "Galle",
    category: "House",
    image: "./r2.png",
  },
  {
    id: 104,
    title: "Agricultural Land in Kurunegala",
    price: "6,500,000",
    date: "2025-11-11",
    location: "Kurunegala",
    category: "Land",
    image: "./l2.jpg",
  },
];

const Profile = () => {
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    mobile: "",
    city: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser({
          id: res.data.id,
          name: res.data.name,
          email: res.data.email,
          mobile: res.data.mobile,
          city: res.data.city,
        });
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    if (!user.name || !user.mobile || !user.city) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill out all required fields before saving.",
        confirmButtonColor: "#ab9272",
      });
    }

    // Remove leading 0
    let mobileNumber = user.mobile.trim();
    if (mobileNumber.startsWith("0")) mobileNumber = mobileNumber.slice(1);

    // 🔹 Validate 9 digits
    if (!/^\d{9}$/.test(mobileNumber)) {
      return Swal.fire({
        icon: "warning",
        title: "Invalid Mobile Number",
        text: "Phone number must contain exactly 9 digits.",
        confirmButtonColor: "#ab9272",
      });
    }
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        {
          name: user.name,
          mobile: mobileNumber,
          city: user.city,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your profile has been updated successfully.",
        confirmButtonColor: "#000000",
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Update failed. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: message,
        confirmButtonColor: "#d33",
      });
      console.error("Update failed:", message);
    }
  };

  const [activeTab, setActiveTab] = useState("PROFILE");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");

  const filteredAds = dummyAds.filter((ad) => {
    const matchesSearch = ad.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || ad.category === filterCategory;
    const matchesLocation =
      filterLocation === "All" || ad.location === filterLocation;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <>
      <Header />
      <div className="profile-content blue-bg">
        <div className="profile-container innerWidth paddings">
          {/* ================================
              LEFT SIDEBAR  
          ================================== */}
          <div className="profile-box">
            <div className="profile-left">
              <div className="user-info-box">
                <div className="user-avatar">AD</div>
                <div>
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>

              <ul className="sidebar-menu">
                {["PROFILE", "ADVERTISEMENTS", "FAVORITES"].map((item) => (
                  <li
                    key={item}
                    className={activeTab === item ? "active" : ""}
                    onClick={() => setActiveTab(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* ================================
              CENTER CONTENT  
          ================================== */}
            <div
              className={
                activeTab === "FAVORITES"
                  ? "profile-center full-width"
                  : "profile-center"
              }
            >
              {activeTab === "PROFILE" && (
                <>
                  <h2>Personal Information</h2>
                  <p className="subtext small">
                    View and edit your account details easily.
                  </p>

                  <div className="form-section">
                    <label>Name</label>
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                    />

                    <label>Email</label>
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      className="readonly-input"
                    />

                    <label>Phone</label>
                    <div className="mobile-wrapper">
                      <span className="country-code profile">+94</span>
                      <input
                        type="text"
                        className="mobile-number"
                        value={user.mobile}
                        onChange={(e) =>
                          setUser({ ...user, mobile: e.target.value })
                        }
                      />
                    </div>

                    <label>City</label>
                    <select
                      value={user.city}
                      onChange={(e) =>
                        setUser({ ...user, city: e.target.value })
                      }
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

                    <div className="center-btn">
                      <button
                        className="button-2 save-btn"
                        onClick={handleUpdate}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "ADVERTISEMENTS" && (
                <div className="ads-section full-width">
                  {/* FILTER BAR */}
                  <div className="ads-filter-bar">
                    <input
                      type="text"
                      placeholder="Search by title..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                    >
                      <option value="All">All Categories</option>
                      <option value="House">House</option>
                      <option value="Land">Land</option>
                    </select>

                    <select
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                    >
                      <option value="All">All Locations</option>
                      <option value="Colombo">Colombo</option>
                      <option value="Kandy">Kandy</option>
                      <option value="Galle">Galle</option>
                      <option value="Kurunegala">Kurunegala</option>
                    </select>
                  </div>

                  {/* ADS GRID */}
                  <div className="ads-grid">
                    {filteredAds.map((item) => (
                      <div key={item.id} className="ad-card">
                        <img src={item.image} alt={item.title} />

                        <h4 className="ad-title">{item.title}</h4>
                        <p className="ad-price">Rs {item.price}</p>
                        <p className="ad-details">
                          {item.date} | {item.location}
                        </p>
                        <span className="ad-category-tag">{item.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ======================
                  FAVORITES TAB CONTENT
              ====================== */}
              {activeTab === "FAVORITES" && (
                <div className="favorites-grid">
                  {dummyFavorites.map((item) => (
                    <div key={item.id} className="favorite-card">
                      <div className="remove-bar">
                        <span>Remove ad</span>
                        <span className="remove-icon">✖</span>
                      </div>

                      <img src={item.image} alt={item.title} />

                      <h4 className="fav-title">{item.title}</h4>

                      <p className="fav-price">Rs {item.price}</p>

                      <p className="fav-details">
                        {item.date} | {item.location}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ================================
              RIGHT SIDEBAR  
          ================================== */}
            {activeTab !== "FAVORITES" && activeTab !== "ADVERTISEMENTS" && (
              <div className="profile-right">
                <div className="profile-card">
                  <div className="avatar-large">AD</div>
                  <p className="welcome">Welcome, {user.name}!</p>
                  <p className="small">{user.email}</p>
                </div>

                <div className="side-box partner-box">
                  <div className="side-icon">👤</div>
                  <h3>Become a Partner</h3>
                  <p>
                    Partner with us to unlock new opportunities and grow
                    together.
                  </p>
                  <button className="button-2 side-btn">Register Here</button>
                </div>

                <div className="side-box center-box">
                  <div className="side-icon">📄</div>
                  <h3>Center Registration</h3>
                  <p>
                    Register now to expand your reach and unlock opportunities.
                  </p>
                  <button className="button-2 side-btn">Register</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <GetStarted />
      <Footer />
    </>
  );
};

export default Profile;
