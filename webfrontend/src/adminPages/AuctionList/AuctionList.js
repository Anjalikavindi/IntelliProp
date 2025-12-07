import React, { useState } from "react";
import { FaPhone, FaTrash } from "react-icons/fa";
import "./AuctionList.css";

const mockAuctionAds = [
  {
    id: 501,
    adTitle: "Prime Residential Plot near City Center",
    city: "Colombo",
    startingPrice: "LKR 5M",
    currentHighestBid: "LKR 5.5M",
    highestBidder: "Alex Fernando",
    highestBidderEmail: "alex@example.com", 
    sellerName: "Kamal Perera", 
    sellerEmail: "kamal@seller.com", 
    auctionEndTime: "2025-12-10 14:00",
    status: "Active",
  },
  {
    id: 502,
    adTitle: "Commercial Land facing Main Highway",
    city: "Kandy",
    startingPrice: "LKR 10M",
    currentHighestBid: "LKR 10.1M",
    highestBidder: "Bhanu Rajapakshe",
    highestBidderEmail: "bhanu@example.com", 
    sellerName: "Sunil Silva", 
    sellerEmail: "sunil@seller.com", 
    auctionEndTime: "2025-12-05 10:00",
    status: "Completed",
  },
  {
    id: 503,
    adTitle: "Agricultural Farm Land with Water Access",
    city: "Anuradhapura",
    startingPrice: "LKR 2.5M",
    currentHighestBid: "N/A",
    highestBidder: "N/A",
    highestBidderEmail: "N/A", 
    sellerName: "Nimali Fernando", 
    sellerEmail: "nimali@seller.com", 
    auctionEndTime: "2025-12-20 18:00",
    status: "Active",
  },
  {
    id: 504,
    adTitle: "Beachfront Tourist Zone Plot",
    city: "Galle",
    startingPrice: "LKR 25M",
    currentHighestBid: "LKR 28M",
    highestBidder: "Chandrika Silva",
    highestBidderEmail: "chandrika@example.com", 
    sellerName: "Priya Rajan", 
    sellerEmail: "priya@seller.com", 
    auctionEndTime: "2025-12-12 11:30",
    status: "Active",
  },
];

const AuctionList = () => {
  const [auctionAds, setAuctionAds] = useState(mockAuctionAds);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCall = (id) => {
    alert(`Simulating Call action for Auction ID: ${id}.`);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete Auction ID: ${id}?`)) {
      setAuctionAds((prevAds) => prevAds.filter((ad) => ad.id !== id));
    }
  };

  // Filter ads based on search term (ad title or city)
  const filteredAds = auctionAds.filter(
    (ad) =>
      ad.adTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-wrapper">
      <div className="admin-dashboard-content padding-top">
        <h2 className="list-title">Land Auction Details</h2>

        {/* Search/Filter Bar */}
        <div className="list-actions-bar">
          <input
            type="text"
            placeholder="Search by Ad Title or City..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="list-search-input"
          />
          <button className="add-new-btn">+ Create New Auction</button>
        </div>

        {/* Auction Ads Table */}
        <div className="table-container">
          <table className="auction-ads-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ad Title & City</th>
                <th>Starting Price</th>
                <th>Highest Bid</th>
                <th>Highest Bidder</th>
                <th>Seller Details</th>
                <th>End Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAds.length > 0 ? (
                filteredAds.map((ad) => (
                  <tr key={ad.id}>
                    <td data-label="ID">{ad.id}</td>
                    <td data-label="Ad Title & City" className="td-title-city">
                      <div className="title-city-group">
                        <span className="ad-title">{ad.adTitle}</span>
                        <span className="ad-city">{ad.city}</span>
                      </div>
                    </td>
                    <td data-label="Starting Price" className="td-price-start">
                      {ad.startingPrice}
                    </td>
                    <td data-label="Highest Bid" className="td-price-highest">
                      <span className="highest-bid-amount">
                        {ad.currentHighestBid}
                      </span>
                    </td>
                    <td data-label="Highest Bidder" className="td-bidder-name">
                      <div className="bidder-details-group">
                        <span className="bidder-name">{ad.highestBidder}</span> 
                        <span className="bidder-email">
                          {ad.highestBidderEmail}
                        </span>
                      </div>
                    </td>
                    <td
                      data-label="Seller Details"
                      className="td-seller-details"
                    >
                      <div className="seller-details-group">
                        <span className="seller-name">{ad.sellerName}</span>   
                        <span className="seller-email">{ad.sellerEmail}</span>
                      </div>
                    </td>
                    <td data-label="End Time" className="td-end-time">
                      {ad.auctionEndTime}
                    </td>
                    <td data-label="Status">
                      <span
                        className={`status-badge status-${ad.status.toLowerCase()}`}
                      >
                        {ad.status}
                      </span>
                    </td>
                    <td data-label="Actions" className="td-actions">
                      <button
                        className="action-btn call-btn" // Changed class
                        title="Call Highest Bidder"
                        onClick={() => handleCall(ad.id)}
                      >
                        <FaPhone />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        title="Delete Auction"
                        onClick={() => handleDelete(ad.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-results">
                    No auction ads found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-placeholder">
          {/* Pagination/Load More Controls */}
        </div>
      </div>
    </div>
  );
};

export default AuctionList;
