import React, { useState } from "react";
import {
  FaEye,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import "./LandList.css"; // Import the CSS file

// Mock Data for the list of land advertisements
const mockLandAds = [
  {
    id: 101,
    thumbnail: "/l1.jpg",
    title: "Prime Residential Plot near City Center",
    city: "Colombo",
    landType: "Residential",
    size: "15.5 Perches",
    createdAt: "2024-10-01",
    isBiddingAllowed: true,
    publishedStatus: "Published",
    sellerName: "Kamal Perera",
  },
  {
    id: 102,
    thumbnail: "/l2.jpg",
    title: "Commercial Land facing Main Highway",
    city: "Kandy",
    landType: "Commercial",
    size: "2.0 Acres",
    createdAt: "2024-10-05",
    isBiddingAllowed: true,
    publishedStatus: "Removed",
    sellerName: "Sunil Silva",
  },
  {
    id: 103,
    thumbnail: "/l3.jpg",
    title: "Agricultural Farm Land with Water Access",
    city: "Anuradhapura",
    landType: "Agricultural",
    size: "10 Hectares",
    createdAt: "2024-10-10",
    isBiddingAllowed: false,
    publishedStatus: "Pending",
    sellerName: "Nimali Fernando",
  },
  {
    id: 104,
    thumbnail: "/l1.jpg",
    title: "Beachfront Tourist Zone Plot",
    city: "Galle",
    landType: "Commercial",
    size: "50 Perches",
    createdAt: "2024-10-15",
    isBiddingAllowed: true,
    publishedStatus: "Published",
    sellerName: "Priya Rajan",
  },
];

const LandList = () => {
  const [landAds, setLandAds] = useState(mockLandAds);
  const [searchTerm, setSearchTerm] = useState("");

  // Handler to toggle the Bidding status of an ad
  const handleToggleBid = (id) => {
    setLandAds((prevAds) =>
      prevAds.map((ad) =>
        ad.id === id ? { ...ad, isBiddingAllowed: !ad.isBiddingAllowed } : ad
      )
    );
  };

  const handleApproveAd = (id) => {
    alert(`Approving ad ID: ${id}. (In a real app, status would change to Published)`);
    // Example state update for publishing (if status was 'Pending'):
    /*
    setLandAds((prevAds) =>
      prevAds.map((ad) =>
        ad.id === id ? { ...ad, publishedStatus: "Published" } : ad
      )
    );
    */
  };

  // Filter ads based on search term (title or city)
  const filteredAds = landAds.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-wrapper">
      <div className="admin-dashboard-content padding-top">
        <h2 className="list-title">Land Advertisements</h2>

        {/* Search/Filter Bar */}
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

        {/* Land Ads Table */}
        <div className="table-container">
          <table className="land-ads-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Thumbnail</th>
                <th>Title & City</th>
                <th>Seller Name</th>
                <th>Type & Size</th>
                <th>Created At</th>
                <th>Bid Status</th>
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
                        className="land-thumbnail"
                      />
                    </td>
                    <td data-label="Title & City" className="td-title-city">
                      <div className="title-city-group">
                        <span className="ad-title">{ad.title}</span>
                        <span className="ad-city">{ad.city}</span>
                      </div>
                    </td>
                    <td data-label="Seller Name" className="td-seller-name">
                      {ad.sellerName}                   {" "}
                    </td>
                    <td data-label="Type & Size">
                      <div className="type-size-group">
                        <span className="ad-type">{ad.landType}</span>
                        <span className="ad-size">{ad.size}</span>
                      </div>
                    </td>
                    <td data-label="Created At">{ad.createdAt}</td>
                    <td data-label="Bid Status" className="td-bidding-status">
                      <button
                        onClick={() => handleToggleBid(ad.id)}
                        className={`allow-bidding-toggle ${
                          ad.isBiddingAllowed ? "allowed" : "notallowed"
                        }`}
                        title={
                          ad.isBiddingAllowed
                            ? "Click to Dissable Bidding"
                            : "Click to Enable Bidding"
                        }
                      >
                        {ad.isBiddingAllowed ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </td>
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
                      <button className="action-btn publish-btn" title="Approve & Publish Ad" onClick={() => handleApproveAd(ad.id)}>
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
                  <td colSpan="9" className="no-results">
                    No land ads found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Placeholder (for a real application) */}
        <div className="pagination-placeholder">
          {/* <button disabled>Previous</button><span>Page 1 of 5</span><button>Next</button> */}
        </div>
      </div>
    </div>
  );
};

export default LandList;
