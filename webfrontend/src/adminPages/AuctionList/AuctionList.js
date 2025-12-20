import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPhone, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import "./AuctionList.css";

const AuctionList = () => {
  const [auctionAds, setAuctionAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        "http://localhost:5000/api/admin/ads/auctions",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAuctionAds(response.data);
    } catch (err) {
      console.error("Failed to fetch auctions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently remove the auction record.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(
          `http://localhost:5000/api/admin/ads/auctions/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAuctionAds((prev) => prev.filter((ad) => ad.id !== id));
        Swal.fire("Deleted!", "Auction has been removed.", "success");
      } catch (error) {
        Swal.fire("Error", "Could not delete auction.", "error");
      }
    }
  };

  const handleCall = (bidderMobile, bidderName) => {
    if (!bidderMobile) {
      Swal.fire(
        "Not Available",
        "This bidder has no contact number or no bids placed.",
        "info"
      );
      return;
    }
    // This opens the phone dialer on mobile devices
    window.location.href = `tel:${bidderMobile}`;
  };

  // Filter ads based on search term (ad title or city)
  const filteredAds = auctionAds.filter(
    (ad) =>
      ad.adTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loader">Loading Auctions...</div>;

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
                        title={`Call ${ad.highestBidder}`}
                        onClick={() => handleCall(ad.bidderMobile, ad.highestBidder)}
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
