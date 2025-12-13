import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaEye,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
  FaTrash,
  FaUpload,
  FaHome, // Icon for Bedrooms/Bathrooms/Floors (optional, replacing FaEdit)
} from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./ResidenciesList.css";

const MySwal = withReactContent(Swal);

const ResidenciesList = () => {
  const [residencyAds, setResidencyAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 

  // Function to fetch data from the backend
  const fetchResidencies = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("adminToken"); // Ensure you pass the token for protected routes
      const response = await axios.get(
        "http://localhost:5000/api/admin/ads/residencies",
        { headers: { Authorization: `Bearer ${token}` } } // Assuming token-based authentication
      );
      setResidencyAds(response.data);
    } catch (err) {
      console.error("Error fetching residency ads:", err);
      setError(
        "Failed to load residency ads. Please check the server connection."
      );
      // If unauthorized, redirect to login
      if (err.response && err.response.status === 401) {
        window.location.href = "/admin/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidencies();
  }, []);

  const handleApproveAd = async (id) => {
    try {
      // const token = localStorage.getItem('adminToken');
      // await axios.put(`http://localhost:5000/api/admin/ads/publish/${id}`,
      //     {},
      //     { headers: { Authorization: `Bearer ${token}` } }
      // );

      MySwal.fire({
        icon: "success",
        title: "Published!",
        text: `Residency ad ID: ${id} has been published.`,
        showConfirmButton: false,
        timer: 1500,
      });

      // Simulate state update
      setResidencyAds((prevAds) =>
        prevAds.map((ad) =>
          ad.id === id ? { ...ad, publishedStatus: "Published" } : ad
        )
      );
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Publish Failed",
        text:
          error.response?.data?.message || `Failed to publish ad ID: ${id}.`,
      });
    }
  };

  // Filter ads based on search term (title or city)
  const filteredAds = residencyAds.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <div className="admin-dashboard-content padding-top">
          <p>Loading residency advertisements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-wrapper">
        <div className="admin-dashboard-content padding-top">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="admin-dashboard-content padding-top">
        <h2 className="list-title">Residency Advertisements</h2>
        <div className="list-actions-bar">
          <input
            type="text"
            placeholder="Search by Title, City, or Seller..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="list-search-input"
          />
          <button className="add-new-btn">+ Add New Ad</button>
        </div>
        {/* Residencies Ads Table */}
        <div className="table-container">
          <table className="residency-ads-table">
            <thead>
              <tr>
                <th>ID</th> 
                <th>Thumbnail</th>
                <th>Title & City</th>
                <th>Seller Name</th> 
                <th>Size & Area</th>
                <th>Beds & Baths</th> 
                <th>Price</th>
                <th>Created At</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAds.length > 0 ? (
                filteredAds.map((ad) => (
                  <tr key={ad.id}>
                    <td data-label="ID">{ad.id}</td>
                    <td data-label="Thumbnail" className="td-thumbnail">
                      <img
                        src={ad.thumbnail}
                        alt={`Thumbnail for ${ad.title}`}
                        className="residency-thumbnail"
                      />
                    </td>
                    <td data-label="Title & City" className="td-title-city">
                      <div className="title-city-group">
                        <span className="ad-title">{ad.title}</span>
                        <span className="ad-city">{ad.city}</span>
                      </div>
                    </td>
                    <td data-label="Seller Name" className="td-seller-name">
                      {ad.sellerName}
                    </td>
                    <td data-label="Size & Area">
                      <div className="size-area-group">
                        <span className="ad-size">Land: {ad.landSize}</span>
                        <span className="ad-area">Area: {ad.area}</span>
                      </div>
                    </td>
                    <td data-label="Beds & Baths">
                      <div className="beds-baths-group">
                        <span className="ad-beds-baths">
                          {ad.bedrooms}Beds | {ad.bathrooms}Baths
                        </span>
                        <span className="ad-floors">{ad.floors} Floors</span>
                      </div>
                    </td>
                    <td data-label="Price" className="td-price">
                      {ad.price}
                    </td>
                    <td data-label="Created At">{ad.createdAt}</td>
                    <td data-label="Published">
                      <span
                        className={`published-status status-${ad.publishedStatus.toLowerCase()}`}
                      >
                        {ad.publishedStatus}
                      </span>
                    </td>
                    <td data-label="Actions" className="td-actions">
                      <button
                        className="action-btn view-btn"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="action-btn publish-btn"
                        title="Approve & Publish Ad"
                        onClick={() => handleApproveAd(ad.id)}
                      >
                        <FaUpload />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        title="Delete Ad"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="no-results">
                    No residency ads found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination-placeholder">
          {/* <button disabled>Previous</button><span>Page 1 of 5</span><button>Next</button> */}
        </div>
      </div>
    </div>
  );
};

export default ResidenciesList;
