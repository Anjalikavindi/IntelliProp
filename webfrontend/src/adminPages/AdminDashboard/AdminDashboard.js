import React, { useState } from 'react';
import "./AdminDashboard.css";
import Sidebar from "../../adminComponents/Sidebar/Sidebar";
import AdminHeader from "../../adminComponents/AdminHeader/AdminHeader";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="dashboard-wrapper">

      {/* <Sidebar />
      <AdminHeader /> */}

      <div className="admin-dashboard-content">
        {/* <div className="cards-row">
          <div className="card blue">
            <h3>Bookings</h3>
            <h1>281</h1>
            <p>+55% than last week</p>
          </div>

          <div className="card green">
            <h3>Today's Users</h3>
            <h1>2300</h1>
            <p>+3% than last month</p>
          </div>

          <div className="card pink">
            <h3>Revenue</h3>
            <h1>34k</h1>
            <p>+1% than yesterday</p>
          </div>

          <div className="card red">
            <h3>Followers</h3>
            <h1>+91</h1>
            <p>Just updated</p>
          </div>
        </div>

        <div className="charts-row">
          <div className="chart-card">Website Views (Chart Placeholder)</div>
          <div className="chart-card">Daily Sales (Chart Placeholder)</div>
          <div className="chart-card">Completed Tasks (Chart Placeholder)</div>
        </div>

        <div className="bottom-row">
          <div className="projects-card">
            <h3>Projects</h3>
            <p>30 done this month</p>
          </div>

          <div className="orders-card">
            <h3>Orders Overview</h3>
            <p>24% this month</p>
          </div>
        </div> */}
      </div>

    </div>
  )
}

export default AdminDashboard
