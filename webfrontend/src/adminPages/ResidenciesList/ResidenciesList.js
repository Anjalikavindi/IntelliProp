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
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./ResidenciesList.css";

const MySwal = withReactContent(Swal);

const ResidenciesList = () => {
  const [residencyAds, setResidencyAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  //View Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const handleApproveAd = async (adData) => {
    const adIdToUse = adData.adId;
    const houseIdToDisplay = adData.id;

    //Confirmation SweetAlert
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: `Do you want to publish Residency Ad ID: ${houseIdToDisplay}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#007e6e",
      cancelButtonColor: "#E7DEAF",
      confirmButtonText: "Yes, publish it!",
    });

    if (!result.isConfirmed) {
      return; // Stop if the admin cancels
    }

    try {
      const token = localStorage.getItem("adminToken");

      //Call the new backend endpoint to publish/update status
      await axios.put(
        // Make sure the path is correct
        `http://localhost:5000/api/admin/ads/publish/${adIdToUse}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      MySwal.fire({
        icon: "success",
        title: "Published!",
        text: `Residency ad ID: ${houseIdToDisplay} has been published.`,
        showConfirmButton: false,
        timer: 1500,
      });

      // Simulate state update
      setResidencyAds((prevAds) =>
        prevAds.map((ad) =>
          ad.id === houseIdToDisplay
            ? { ...ad, publishedStatus: "Published" }
            : ad
        )
      );
      if (isModalOpen) {
        closeModal();
      }
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Publish Failed",
        text:
          error.response?.data?.message ||
          `Failed to publish ad ID: ${houseIdToDisplay}.`,
      });
    }
  };

  // --- NEW FUNCTION: handleRejectAd ---
  const handleRejectAd = async (adData) => {
    const adIdToUse = adData.adId;
    const houseIdToDisplay = adData.id;

    // Optional: Add logging
    console.log("Rejecting Ad ID (Internal):", adIdToUse);
    console.log("Rejecting Ad ID (Display):", houseIdToDisplay); //Confirmation SweetAlert

    const result = await MySwal.fire({
      title: "Are you sure?",
      text: `Do you want to REJECT Residency Ad ID: ${houseIdToDisplay}? This will hide the ad.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545", // Red color for danger/rejection
      cancelButtonColor: "#E7DEAF",
      confirmButtonText: "Yes, reject it!",
    });

    if (!result.isConfirmed) {
      return; // Stop if the admin cancels
    }

    try {
      const token = localStorage.getItem("adminToken"); // Call the new backend endpoint to reject/update status

      await axios.put(
        `http://localhost:5000/api/admin/ads/reject/${adIdToUse}`, // <<< NEW ENDPOINT
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      MySwal.fire({
        icon: "success",
        title: "Rejected!",
        text: `Residency ad ID: ${houseIdToDisplay} has been rejected.`,
        showConfirmButton: false,
        timer: 1500,
      }); // Simulate state update to show 'Rejected' status immediately

      setResidencyAds((prevAds) =>
        prevAds.map((ad) =>
          ad.id === houseIdToDisplay
            ? { ...ad, publishedStatus: "Rejected" }
            : ad
        )
      );
      if (isModalOpen) {
        closeModal();
      }
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Rejection Failed",
        text:
          error.response?.data?.message ||
          `Failed to reject ad ID: ${houseIdToDisplay}.`,
      });
    }
  };

  const handleViewAd = (ad) => {
    setSelectedAd(ad);
    setCurrentImageIndex(0);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAd(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % selectedAd.images.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + selectedAd.images.length) % selectedAd.images.length
    );
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
                        onClick={() => handleViewAd(ad)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="action-btn publish-btn"
                        title="Approve & Publish Ad"
                        onClick={() => handleApproveAd(ad)}
                      >
                        <FaUpload />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        title="Delete Ad"
                        onClick={() => handleRejectAd(ad)}
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

      {/* --- Modal Component Render --- */}
      {isModalOpen && selectedAd && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="residency-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              &times;
            </button>
            <h3 className="modal-title">{selectedAd.title}</h3>

            <div className="modal-content-grid">
              {/* --- IMAGE GALLERY SECTION --- */}
              <div className="modal-image-section">
                <div className="image-gallery-container">
                  <img
                    src={
                      selectedAd.images[currentImageIndex]?.path ||
                      "/default-house.png"
                    }
                    alt={`Image ${currentImageIndex + 1} of ${
                      selectedAd.title
                    }`}
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
                <p
                  className={`modal-status status-${selectedAd.publishedStatus.toLowerCase()}`}
                >
                  Status: {selectedAd.publishedStatus}
                </p>
              </div>

              {/* --- DETAILS SECTION --- */}
              <div className="modal-details-section">
                <h4 className="detail-header">General Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Property ID:</strong> <span>{selectedAd.id}</span>
                  </div>
                  <div className="detail-item">
                    <strong>City:</strong> <span>{selectedAd.city}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Seller:</strong>{" "}
                    <span>{selectedAd.sellerName}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Created:</strong>{" "}
                    <span>{selectedAd.createdAt}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Email:</strong>{" "}
                    <span>{selectedAd.sellerEmail}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Mobile:</strong>{" "}
                    <span>+94 {selectedAd.sellerMobile}</span>
                  </div>
                </div>

                <h4 className="detail-header">Description</h4>
                <p className="ad-description-text">
                  {selectedAd.description || "No description provided."}
                </p>

                <h4 className="detail-header">Pricing & Specs</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Price:</strong> <span>{selectedAd.price}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Land Size:</strong>{" "}
                    <span>{selectedAd.landSize}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Area:</strong> <span>{selectedAd.area}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Floors:</strong> <span>{selectedAd.floors}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Bedrooms:</strong>{" "}
                    <span>{selectedAd.bedrooms}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Bathrooms:</strong>{" "}
                    <span>{selectedAd.bathrooms}</span>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    className="add-new-btn"
                    onClick={() => handleApproveAd(selectedAd)}
                  >
                    {selectedAd.publishedStatus === "Published"
                      ? "Re-Approve"
                      : "Publish Ad"}
                  </button>
                  <button
                    className="add-new-btn-1"
                    onClick={() => handleRejectAd(selectedAd)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidenciesList;
