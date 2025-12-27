import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import landsData from '../../utils/landsData' 
import GetStarted from '../../components/GetStarted/GetStarted'

import './Lands.css'
import { FaHeart } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Lands = () => {

  const [lands, setLands] = useState([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    verified: '',
    minPrice: '',
    maxPrice: '',
    landSize: ''
  })
  const landsPerPage = 10

  // Fetch lands from API
  useEffect(() => {
    const fetchLands = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/ads/published-lands');
        setLands(response.data);
      } catch (error) {
        console.error("Error loading lands:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLands();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((favId) => favId !== id)
        : [...prev, id]
    )
  }

  // Apply filters
  const filteredLands = lands.filter((land) => {
    const matchesVerified = filters.verified === '' || (filters.verified === 'true' ? land.verified : !land.verified)
    const matchesMinPrice = filters.minPrice === '' || land.price >= Number(filters.minPrice)
    const matchesMaxPrice = filters.maxPrice === '' || land.price <= Number(filters.maxPrice)
    const matchesLandSize = filters.landSize === '' || land.size >= Number(filters.landSize)
    return matchesVerified && matchesMinPrice && matchesMaxPrice && matchesLandSize
  })

  // Pagination
  const indexOfLastLand = currentPage * landsPerPage
  const indexOfFirstLand = indexOfLastLand - landsPerPage
  const currentLands = filteredLands.slice(indexOfFirstLand, indexOfLastLand)
  const totalPages = Math.ceil(filteredLands.length / landsPerPage)

  if (loading) return <div className="loader">Loading Lands...</div>;

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber)

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setFilters({
      verified: '',
      minPrice: '',
      maxPrice: '',
      landSize: ''
    })
    setCurrentPage(1)
  }

  return (
    <>
      <Header />
      {/* BREADCRUMB SECTION */}
      <div className="breadcrumb-section" style={{backgroundImage: `url('/land-bg.jpg')`}}>
        <div className="breadcrumb-content">
          <h2>Lands</h2>
          <p>
            <Link to="/" className="breadcrumb-link">Home</Link> / Lands
          </p>
        </div>
      </div>

      <div className="page-content blue-bg">
        <div className="lands-container innerWidth paddings">
          <div className="lands-layout">
            {/* Left Filter Section */}
            <div className="filter-section">
              <h3>Filter Lands</h3>

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
                placeholder="e.g. 10000"
              />

              <label>Max Price ($)</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="e.g. 500000"
              />

              <label>Minimum Land Size (Perches)</label>
              <input
                type="number"
                name="landSize"
                value={filters.landSize}
                onChange={handleFilterChange}
                placeholder="e.g. 6"
              />

              <button className="button reset-btn" onClick={handleResetFilters}>
                Reset Filters
              </button>
            </div>

            {/* Right Lands Grid */}
            <div className="lands-grid">
              {currentLands.length > 0 ? (
                currentLands.map((land) => (
                  <div key={land.id} className="land-card">
                    <img 
                        src={`http://localhost:5000/images/${land.image}`} 
                        alt={land.title} 
                        className="land-image" 
                        onError={(e) => e.target.src = '/default-land.jpg'}
                    />

                    <div className="land-details">
                      <div className="land-title-row">
                        <h3 className="land-title">{land.title}</h3>
                        <FaHeart
                          className="heart-icon"
                          onClick={() => toggleFavorite(land.id)}
                          style={{
                            color: favorites.includes(land.id) ? 'red' : '#ccc'
                          }}
                        />
                      </div>

                      {land.verified ? (
                        <span className="verified-tag">✔ Verified User</span>
                      ) : (
                        <span className="unverified-tag">Not Verified</span>
                      )}

                      <p className="land-info">
                        {land.size} Perches &nbsp; | &nbsp; {land.city}
                      </p>

                      <div>
                        <span className="secondaryText price">
                          <span style={{ color: 'var(--primary)' }}>LKR</span>
                          <span className="land-price">{Number(land.price).toLocaleString()}</span>
                          <small> /perch</small>
                        </span>
                      </div>

                      <div className="card-bottom">
                        <Link to={`/landdetails/${land.id}`}>
                          <button className="button-2">Find Out More</button>
                        </Link>
                        <p className="land-time">⏰ {new Date(land.published).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-results">No lands match your filters.</p>
              )}

              {/* Pagination */}
              {filteredLands.length > landsPerPage && (
                <div className="pagination">
                  {Array.from({ length: totalPages }, (_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => handlePageChange(idx + 1)}
                      className={currentPage === idx + 1 ? 'active-page' : ''}
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

export default Lands
