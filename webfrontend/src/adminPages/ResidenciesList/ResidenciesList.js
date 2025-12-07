import React, { useState } from "react";
import {
  FaEye,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
  FaTrash,
  FaUpload,
  FaHome, // Icon for Bedrooms/Bathrooms/Floors (optional, replacing FaEdit)
} from "react-icons/fa";
import "./ResidenciesList.css";

const mockResidencyAds = [
  {
    id: 201,
    thumbnail: "/r1.png",
    title: "Luxury Apartment with Sea View",
    city: "Colombo",
    sellerName: "Amara Holdings",
    landSize: "12.5 Perches",
    area: "1500 sqft",
    floors: 1,
    bedrooms: 3,
    bathrooms: 2,
    price: "LKR 55M",
    createdAt: "2024-11-01",
    publishedStatus: "Published",
  },
  {
    id: 202,
    thumbnail: "/r2.png",
    title: "Modern Townhouse near Kandy Lake",
    city: "Kandy",
    sellerName: "Bandara Real Estate",
    landSize: "8 Perches",
    area: "2200 sqft",
    floors: 2,
    bedrooms: 4,
    bathrooms: 3,
    price: "LKR 32M",
    createdAt: "2024-11-05",
    publishedStatus: "Pending",
  },
  {
    id: 203,
    thumbnail: "/r3.png",
    title: "Spacious Villa in Galle Fort",
    city: "Galle",
    sellerName: "Chandra Developers",
    landSize: "30 Perches",
    area: "3500 sqft",
    floors: 2,
    bedrooms: 5,
    bathrooms: 4,
    price: "LKR 90M",
    createdAt: "2024-11-10",
    publishedStatus: "Removed",
  },
];

const ResidenciesList = () => {
  const [residencyAds, setResidencyAds] = useState(mockResidencyAds);
  const [searchTerm, setSearchTerm] = useState(""); // Handler for the 'Approve/Publish' action (using FaUpload)

  const handleApproveAd = (id) => {
    alert(
      `Approving residency ad ID: ${id}. (Status change to Published simulated)`
    );
    setResidencyAds((prevAds) =>
      prevAds.map((ad) =>
        ad.id === id ? { ...ad, publishedStatus: "Published" } : ad
      )
    );
  }; // Filter ads based on search term (title or city)

  const filteredAds = residencyAds.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-wrapper">
      <div className="admin-dashboard-content padding-top">
        <h2 className="list-title">Residency Advertisements</h2>
        <div className="list-actions-bar">
          <input
            type="text"
            placeholder="Search by Title or City..."
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
                <th>ID</th> <th>Thumbnail</th>
                <th>Title & City</th>
                <th>Seller Name</th> <th>Size & Area</th>
                <th>Beds & Baths</th> <th>Price</th>
                <th>Created At</th><th>Published</th>
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
