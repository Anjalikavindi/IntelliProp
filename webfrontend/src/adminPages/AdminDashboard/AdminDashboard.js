import React, { useState } from "react";
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
              <img
                src="/icons/ad.png"
                alt="Bookings Icon"
                className="card-icon"
              />
            </div>
            <div className="card-content">
              <h3>Published Ads</h3>
              <h1>281</h1>
              <hr />
              <p className="growth-indicator">+55% than last week</p>
            </div>
          </div>

          {/* Today's Users Card */}
          <div className="stats-card">
            <div className="icon-container icon-users">
              <img
                src="/icons/work-in-progress.png"
                alt="Bookings Icon"
                className="card-icon"
              />
            </div>
            <div className="card-content">
              <h3>Pending Ads</h3>
              <h1>2,300</h1>
              <hr />
              <p className="growth-indicator">+3% than last month</p>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="stats-card">
            <div className="icon-container icon-revenue">
              <img
                src="/icons/multiple-users-silhouette.png"
                alt="Bookings Icon"
                className="card-icon"
              />
            </div>
            <div className="card-content">
              <h3>Total Users</h3>
              <h1>34k</h1>
              <hr />
              <p className="growth-indicator">+1% than yesterday</p>
            </div>
          </div>

          {/* Followers Card */}
          <div className="stats-card">
            <div className="icon-container icon-followers">
              <img
                src="/icons/verified-user.png"
                alt="Bookings Icon"
                className="card-icon"
              />
            </div>
            <div className="card-content">
              <h3>Verified Users</h3>
              <h1 className="followers-count">+91</h1>
              <hr />
              <p className="last-updated">Just updated</p>
            </div>
          </div>
        </div>

        <div className="charts-row">
          {/* Chart 1: Website Views (Bar Chart) - Updated to have 7 bars */}
          <div className="chart-card chart-bar-blue">
            <div className="chart-visual blue-bg">
              {/* Placeholder for Bar Chart Visualization */}
              <div className="bar-chart-placeholder">
                <div className="bar-chart-y-axis">
                  <div className="bar-chart-label">60</div>
                  <div className="bar-chart-label">40</div>
                  <div className="bar-chart-label">20</div>
                  <div className="bar-chart-label">0</div>
                </div>
                <div className="bar-chart-bars">
                  <div className="bar" style={{ height: "65%" }}></div>
                  <div className="bar" style={{ height: "30%" }}></div>
                  <div className="bar" style={{ height: "55%" }}></div>
                  <div className="bar" style={{ height: "15%" }}></div>
                  <div className="bar" style={{ height: "35%" }}></div>
                  <div className="bar" style={{ height: "65%" }}></div>
                  <div className="bar" style={{ height: "50%" }}></div>
                </div>
                <div className="bar-chart-x-axis">
                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                  <span>S</span>
                </div>
              </div>
            </div>
            <div className="chart-info">
              <h4 className="chart-title">Website Views</h4>
              <p className="chart-description">Last Campaign Performance</p>
              <p className="chart-timestamp">campaign sent 2 days ago</p>
            </div>
          </div>
          {/* Chart 2: Daily Sales (Line Chart Green) */}
          <div className="chart-card chart-line-green">
            <div className="chart-visual green-bg">
              {/* Placeholder for Green Line Chart Visualization */}
              <div className="line-chart-placeholder green-line">
                <div className="line-chart-y-axis">
                  <div className="line-chart-label">600</div>
                  <div className="line-chart-label">400</div>
                  <div className="line-chart-label">200</div>
                  <div className="line-chart-label">0</div>
                </div>
                {/* The 'line' and 'points' are now controlled via CSS/Pseudo-elements */}
                <div className="chart-line-visual"></div>
                <div className="line-chart-x-axis">
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                </div>
              </div>
            </div>
            <div className="chart-info">
              <h4 className="chart-title">Daily Sales</h4>
              <p className="chart-description">
                (+15%) increase in today sales.
              </p>
              <p className="chart-timestamp">updated 4 min ago</p>
            </div>
          </div>
          {/* Chart 3: Completed Tasks (Line Chart Dark) */}
          <div className="chart-card chart-line-dark">
            <div className="chart-visual dark-bg">
              {/* Placeholder for Dark Line Chart Visualization */}
              <div className="line-chart-placeholder dark-line">
                <div className="line-chart-y-axis">
                  <div className="line-chart-label">600</div>
                  <div className="line-chart-label">400</div>
                  <div className="line-chart-label">200</div>
                  <div className="line-chart-label">0</div>
                </div>
                {/* The 'line' and 'points' are now controlled via CSS/Pseudo-elements */}
                <div className="chart-line-visual"></div>
                <div className="line-chart-x-axis">
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                </div>
              </div>
            </div>
            <div className="chart-info">
              <h4 className="chart-title">Completed Tasks</h4>
              <p className="chart-description">Last Campaign Performance</p>
              <p className="chart-timestamp">just updated</p>
            </div>
          </div>
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
  );
};

export default AdminDashboard;
