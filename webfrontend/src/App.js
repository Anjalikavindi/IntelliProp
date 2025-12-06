import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Houses from "./pages/Houses/Houses";
import Lands from "./pages/Lands/Lands";
import ContactUs from "./pages/Contact/ContactUs";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import HouseDetail from "./pages/HouseDetail/HouseDetail";
import LandDetails from "./pages/LandDetails/LandDetails";
import AdDetails from "./pages/PostAds/AdDetails";
import Verify from "./pages/Verify/Verify";
import Profile from "./pages/Profile/Profile";
import ProtectedVerifiedRoute from "./pages/ProtectedVerifiedRoute/ProtectedVerifiedRoute";

//Admin Panel
import AdminDashboard from "./adminPages/AdminDashboard/AdminDashboard";
import Sidebar from "./adminComponents/Sidebar/Sidebar";
import AdminHeader from "./adminComponents/AdminHeader/AdminHeader";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Residencies Page */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/houses" element={<Houses />} />
          <Route path="/lands" element={<Lands />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/verifyyournumber" element={<Verify />} />
          <Route
            path="/postyourad"
            element={
              <ProtectedVerifiedRoute>
                <AdDetails />
              </ProtectedVerifiedRoute>
            }
          />
          <Route path="/housedetails" element={<HouseDetail />} />
          <Route path="/landdetails" element={<LandDetails />} />
          {/* ------------------------- ADMIN PANEL ------------------------- */}
          <Route
            path="/admin"
            element={
              <>
                <Sidebar open={open} setOpen={setOpen} />
                <AdminHeader sidebarOpen={open} setSidebarOpen={setOpen}/>

                <div className={`admin-content ${open ? "shift" : ""}`}>
                  <AdminDashboard />
                </div>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
