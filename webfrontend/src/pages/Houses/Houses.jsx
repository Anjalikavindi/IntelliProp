import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import housesData from "../../utils/housesData";
import "./Houses.css";
import { FaHeart } from "react-icons/fa";
import GetStarted from "../../components/GetStarted/GetStarted";
import { Link } from "react-router-dom";

const Houses = () => {

    const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    bedrooms: "",
    verified: "",
    minPrice: "",
    maxPrice: "",
  });
  const housesPerPage = 10;

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Apply filters
  const filteredHouses = housesData.filter((house) => {
    const matchesBedrooms =
      filters.bedrooms === "" || house.bedrooms === Number(filters.bedrooms);
    const matchesVerified =
      filters.verified === "" ||
      (filters.verified === "true" ? house.verified : !house.verified);
    const matchesMinPrice =
      filters.minPrice === "" || house.price >= Number(filters.minPrice);
    const matchesMaxPrice =
      filters.maxPrice === "" || house.price <= Number(filters.maxPrice);

    return (
      matchesBedrooms && matchesVerified && matchesMinPrice && matchesMaxPrice
    );
  });

  // Pagination calculations
  const indexOfLastHouse = currentPage * housesPerPage;
  const indexOfFirstHouse = indexOfLastHouse - housesPerPage;
  const currentHouses = housesData.slice(indexOfFirstHouse, indexOfLastHouse);
  const totalPages = Math.ceil(housesData.length / housesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      bedrooms: "",
      verified: "",
      minPrice: "",
      maxPrice: "",
    });
    setCurrentPage(1);
  };

  return (
    <>
      <Header />
      {/* BREADCRUMB SECTION */}
      <div
        className="breadcrumb-section"
        style={{ backgroundImage: `url('/residencies-bg.jpg')` }}
      >
        <div className="breadcrumb-content">
          <h2>Residencies</h2>
          <p>
            <Link to="/" className="breadcrumb-link">
              Home
            </Link>{" "}
            / Residencies
          </p>
        </div>
      </div>

      <div className="page-content blue-bg">
        <div className="houses-container innerWidth paddings">
          {/* <h2 className="primaryText">Available Houses</h2> */}

          <div className="houses-layout">
            {/* --- Left Filter Section --- */}
            <div className="filter-section">
              <h3>Filter Houses</h3>

              <label>Bedrooms</label>
              <select
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>

              <label>Verification Status</label>
              <select
                name="verified"
                value={filters.verified}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="true">Verified</option>
                <option value="false">Not Verified</option>
              </select>

              <label>Min Price ($)</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="e.g. 50000"
              />

              <label>Max Price ($)</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="e.g. 200000"
              />

              <button className="button reset-btn" onClick={handleResetFilters}>
                Reset Filters
              </button>
            </div>

            {/* --- Right Houses Grid --- */}
            <div className="houses-grid">
              {currentHouses.length > 0 ? (
                currentHouses.map((house) => (
                  <div key={house.id} className="house-card">
                    <img
                      src={house.image}
                      alt={house.title}
                      className="house-image"
                    />

                    <div className="house-details">
                      <div className="house-title-row">
                        <h3 className="house-title">{house.title}</h3>
                        <FaHeart
                          className="heart-icon"
                          onClick={() => toggleFavorite(house.id)}
                          style={{
                            color: favorites.includes(house.id)
                              ? "red"
                              : "#ccc",
                          }}
                        />
                      </div>

                      {house.verified ? (
                        <span className="verified-tag">✔ Verified</span>
                      ) : (
                        <span className="unverified-tag">Not Verified</span>
                      )}

                      <p className="house-info">
                        {house.bedrooms} Bedrooms &nbsp; | &nbsp;{" "}
                        {house.bathrooms} Bathrooms
                      </p>

                      <div>
                        <span className="secondaryText price">
                          <span style={{ color: "var(--primary)" }}>$</span>
                          <span className="house-price">{house.price}</span>
                        </span>
                      </div>

                      <div className="card-bottom">
                        <Link to={`/housedetails`}>
                          <button className="button-2">Find Out More</button>
                        </Link>
                        <p className="house-time">⏰ {house.published}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-results">No houses match your filters.</p>
              )}

              {/* Pagination Controls */}
              {filteredHouses.length > housesPerPage && (
                <div className="pagination">
                  {Array.from({ length: totalPages }, (_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => handlePageChange(idx + 1)}
                      className={currentPage === idx + 1 ? "active-page" : ""}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <GetStarted />
      </div>
      <Footer />
    </>
  )
}

export default Houses
