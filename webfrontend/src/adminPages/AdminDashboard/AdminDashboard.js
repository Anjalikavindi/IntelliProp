import React, { useState } from 'react';
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="dashboard-wrapper">

      <div className="admin-dashboard-content">
        <div className="cards-row">
          {/* Bookings Card */}
          <div className="stats-card">
            <div className="icon-container icon-bookings">
              <img src="/icons/land.png" alt="Bookings Icon" className="card-icon" />
            </div>
            <div className="card-content">
              <h3>Published Ads</h3>
              <h1>281</h1>
              <hr/>
              <p className="growth-indicator">+55% than last week</p>
            </div>
          </div>

          {/* Today's Users Card */}
          <div className="stats-card">
            <div className="icon-container icon-users">
              <img src="/icons/land.png" alt="Bookings Icon" className="card-icon" />
            </div>
            <div className="card-content">
              <h3>Pending Ads</h3>
              <h1>2,300</h1> 
              <hr/>
              <p className="growth-indicator">+3% than last month</p>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="stats-card">
            <div className="icon-container icon-revenue">
              <img src="/icons/land.png" alt="Bookings Icon" className="card-icon" />
            </div>
            <div className="card-content">
              <h3>Total Users</h3>
              <h1>34k</h1>
              <hr/>
              <p className="growth-indicator">+1% than yesterday</p>
            </div>
          </div>

          {/* Followers Card */}
          <div className="stats-card">
            <div className="icon-container icon-followers">
              <img src="/icons/land.png" alt="Bookings Icon" className="card-icon" />
            </div>
            <div className="card-content">
              <h3>Followers</h3>
              <h1 className="followers-count">+91</h1>
              <hr/>
              <p className="last-updated">Just updated</p>
            </div>
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
        </div>
      </div>

    </div>
  )
}

export default AdminDashboard
