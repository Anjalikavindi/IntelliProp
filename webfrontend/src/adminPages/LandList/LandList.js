import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaEye,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import "./LandList.css"; // Import the CSS file

const LandList = () => {
  const [landAds, setLandAds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const IMAGE_BASE_URL = "http://localhost:5000/images/";

  // Fetch data from Backend
  const fetchLandAds = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/ads/lands"
      );
      setLandAds(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch lands", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLandAds();
  }, []);

  const handleViewAd = (ad) => {
    setSelectedAd(ad);
    setCurrentImageIndex(0);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAd(null);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % selectedAd.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + selectedAd.images.length) % selectedAd.images.length
    );
  };

  const handleToggleBid = async (id, currentStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/ads/lands/toggle-bid/${id}`,
        {
          allowBidding: !currentStatus,
        }
      );
      // Refresh local state
      setLandAds((prev) =>
        prev.map((ad) =>
          // Change 'adId' to 'ad.adId' and 'adId' to 'id'
          ad.adId === id ? { ...ad, allowBidding: !currentStatus } : ad
        )
      );
    } catch (error) {
      alert("Failed to update bidding status");
    }
  };

  // Filter ads based on search term (title or city)
  const filteredAds = landAds.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="padding-top">Loading Land Ads...</div>;

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
                        src={
                          ad.thumbnail
                            ? `${IMAGE_BASE_URL}${ad.thumbnail}`
                            : "/placeholder-image.png"
                        }
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
                      {ad.sellerName}
                    </td>
                    <td data-label="Type & Size">
                      <div className="type-size-group">
                        <span className="ad-type">{ad.landType}</span>
                        <span className="ad-size">{ad.landSize} Perches</span>
                      </div>
                    </td>
                    <td data-label="Created At">{ad.createdAt}</td>
                    <td data-label="Bid Status" className="td-bidding-status">
                      <button
                        onClick={() =>
                          handleToggleBid(ad.adId, ad.allowBidding)
                        }
                        className={`allow-bidding-toggle ${
                          ad.allowBidding ? "allowed" : "notallowed"
                        }`}
                        title={
                          ad.allowBidding
                            ? "Click to Dissable Bidding"
                            : "Click to Enable Bidding"
                        }
                      >
                        {ad.allowBidding ? <FaToggleOn /> : <FaToggleOff />}
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
                        onClick={() => handleViewAd(ad)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="action-btn publish-btn"
                        title="Approve & Publish Ad"
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

      {/* --- Land Detail Modal --- */}
      {isModalOpen && selectedAd && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="residency-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              &times;
            </button>
            <h3 className="modal-title">{selectedAd.title}</h3>

            <div className="modal-content-grid">
              <div className="modal-image-section">
                <div className="image-gallery-container">
                  <img
                    src={
                      selectedAd.images[currentImageIndex]
                        ? `${IMAGE_BASE_URL}${selectedAd.images[currentImageIndex].path}`
                        : "/placeholder-image.png"
                    }
                    alt="Property"
                    className="modal-main-image"
                  />
                  {selectedAd.images.length > 1 && (
                    <>
                      <button
                        className="gallery-nav-btn prev-btn"
                        onClick={prevImage}
                      >
                        &lt;
                      </button>
                      <button
                        className="gallery-nav-btn next-btn"
                        onClick={nextImage}
                      >
                        &gt;
                      </button>
                    </>
                  )}
                </div>
                <div className="modal-image-counter">
                  {currentImageIndex + 1} / {selectedAd.images.length}
                </div>
              </div>

              <div className="modal-details-section">
                <h4 className="detail-header">Land Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>ID:</strong> <span>{selectedAd.id}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Type:</strong> <span>{selectedAd.landType}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Size:</strong>{" "}
                    <span>{selectedAd.landSize} Perches</span>
                  </div>
                  <div className="detail-item">
                    <strong>City:</strong> <span>{selectedAd.city}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Price per Perch:</strong>{" "}
                    <span>{selectedAd.formattedPrice}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Seller:</strong>{" "}
                    <span>{selectedAd.sellerName}</span>
                  </div>
                </div>

                <h4 className="detail-header">Description</h4>
                <p className="ad-description-text">
                  {selectedAd.description || "No description provided."}
                </p>

                <div className="modal-actions">
                  <button className="add-new-btn">Approve</button>
                  <button className="add-new-btn-1">Reject</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandList;
