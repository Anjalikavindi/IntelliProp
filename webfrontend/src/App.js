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
import AdminLogin from "./adminPages/AdminLogin/AdminLogin";
import Sidebar from "./adminComponents/Sidebar/Sidebar";
import AdminHeader from "./adminComponents/AdminHeader/AdminHeader";
import AdminDashboard from "./adminPages/AdminDashboard/AdminDashboard";
import LandList from "./adminPages/LandList/LandList";

import { Outlet, Navigate } from "react-router-dom";
import ResidenciesList from "./adminPages/ResidenciesList/ResidenciesList";
import AuctionList from "./adminPages/AuctionList/AuctionList";
import UsersList from "./adminPages/UsersList/UsersList";
import AdminProfile from "./adminPages/AdminProfile/AdminProfile";
import AdminRegister from "./adminPages/AdminRegister/AdminRegister";
import ManageEmployees from "./adminPages/ManageEmployees/ManageEmployees";

import SessionManager from "./adminComponents/SessionManager/SessionManager";

// Helper component to wrap all Admin Panel pages with the fixed layout
const AdminLayout = ({ open, setOpen }) => (
  <>
    <Sidebar open={open} setOpen={setOpen} />
    <AdminHeader sidebarOpen={open} setSidebarOpen={setOpen} />
    <div className={`admin-content ${open ? "shift" : ""}`}>
      {/* The Outlet renders the matched child route component (AdminDashboard or LandList) */}
      <Outlet /> 
    </div>
  </>
);

const AdminProtectedRoute = ({ children }) => {

  const isAdminAuthenticated = localStorage.getItem("adminToken") ? true : false;
  const adminLoginPath = "/admin/login";

  if (!isAdminAuthenticated) {
    // Redirect to the Admin Login page if not authenticated
    return <Navigate to={adminLoginPath} replace />;
  }
  
  // If authenticated, render the child routes (AdminLayout)
  return children;
};

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
          <Route path="/landdetails/:id" element={<LandDetails />} />

          {/* ------------------------- ADMIN PANEL ------------------------- */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/admin-register" element={<AdminRegister/>}/>
          <Route 
            path="/admin" 
            element={<AdminProtectedRoute>
                {/* AdminLayout includes Sidebar and Header */}
                <SessionManager>
                <AdminLayout open={open} setOpen={setOpen} />
                </SessionManager>
              </AdminProtectedRoute>}
          >            
            <Route index element={<Navigate to="dashboard" replace />} /> 
            <Route path="dashboard" element={<AdminDashboard />} /> 
            <Route path="residencies-ads" element={<ResidenciesList/>}/> 
            <Route path="land-ads" element={<LandList />} /> 
            <Route path="land-auctions" element={<AuctionList/>}/>
            <Route path="registered-users" element={<UsersList/>}/>
            <Route path="admin-profile" element={<AdminProfile/>}/>
            <Route path="manage-admins" element={<ManageEmployees/>}/>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
