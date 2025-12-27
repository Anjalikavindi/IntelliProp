import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header/Header";
import GetStarted from "../../components/GetStarted/GetStarted";
import Footer from "../../components/Footer/Footer";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import data from "../../utils/sliderland.json";
import { sliderSetting } from "../../utils/houseRecommendations";
import {
  FaHeart,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import "./LandDetails.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LandDetails = () => {
  const { id } = useParams();
  const [land, setLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [showMobile, setShowMobile] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  const [userBid, setUserBid] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  // Track favorite status for each card
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchLandDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/ads/published-lands/${id}`
        );
        setLand(res.data);
        // Set first image or thumbnail as main image
        const thumb =
          res.data.images.find((img) => img.is_thumbnail) || res.data.images[0];
        setMainImage(thumb?.image_path);
      } catch (err) {
        console.error("Error fetching land details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLandDetails();
  }, [id]);

  useEffect(() => {
    if (land?.auction_end && land.auction_status === "Active") {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const endTime = new Date(land.auction_end).getTime();
        const distance = endTime - now;

        if (distance < 0) {
          clearInterval(timer);
          setTimeLeft("Auction Closed");
          setIsExpired(true);
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [land]);

  const handlePlaceBid = async () => {
    if (!token) {
      alert("Please login or register to place a bid.");
      return;
    }

    const minBid = land.current_highest_bid || land.price_per_perch;
    if (Number(userBid) <= Number(minBid)) {
      alert(
        `Your bid must be higher than LKR ${Number(minBid).toLocaleString()}`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/ads/place-bid",
        { ad_id: land.ad_id, bid_amount: userBid },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);
      setUserBid("");
      // Refresh details to show new highest bid
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Error placing bid");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle heart color on click
  const toggleFavorite = (index) => {
    setFavorites((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  if (loading) return <div className="loader">Loading Details...</div>;
  if (!land) return <div className="error">Ad not found.</div>;

  const serverUrl = "http://localhost:5000/images/";

  return (
    <>
      <Header />

      {/* Breadcrumb */}
      <div
        className="breadcrumb-section"
        style={{ backgroundImage: `url('/land-bg.jpg')` }}
      >
        <div className="breadcrumb-content">
          <h2>{land.title}</h2>
          <p>
            <Link to="/" className="breadcrumb-link">
              Home
            </Link>{" "}
            /{" "}
            <Link to="/landdetails" className="breadcrumb-link">
              Lands
            </Link>{" "}
            / {land.title}
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="detail-wrapper blue-bg">
        <div className="house-detail innerWidth paddings">
          {/* LEFT SIDE: IMAGES + DESCRIPTION */}
          <div className="left-section-land">
            {/* Main Image */}
            <div className="main-image">
              <img src={`${serverUrl}${mainImage}`} alt={land.title} />
              <span className="image-count">{land.images.length} Images</span>
            </div>

            {/* Thumbnail Images */}
            <div className="thumbnail-row">
              {land.images.map((img, index) => (
                <img
                  key={index}
                  src={`${serverUrl}${img.image_path}`}
                  alt="thumbnail"
                  onClick={() => setMainImage(img.image_path)}
                  className={mainImage === img.image_path ? "active-thumb" : ""}
                />
              ))}
            </div>

            {/* Core Information */}
            <div className="core-info">
              <h3>Core Information</h3>

              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">
                    <img src="/icons/price-tag.png" alt="Type Icon" />
                    <p className="label">Type</p>
                  </div>
                  <p className="value">Sale</p>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <img src="/icons/land.png" alt="Land Icon" />
                    <p className="label">Land Size</p>
                  </div>
                  <p className="value">{land.land_size} Perches</p>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <img src="/icons/roundabout.png" alt="Area Icon" />
                    <p className="label">Land Type</p>
                  </div>
                  <p className="value">{land.land_type}</p>
                </div>

                {/* <div className="info-item">
                  <div className="info-label">
                    <img src="/icons/bedroom.png" alt="Bedrooms Icon" />
                    <p className="label">Bedrooms</p>
                  </div>
                  <p className="value">3</p>
                </div> */}

                {/* <div className="info-item">
                  <div className="info-label">
                    <img src="/icons/bath.png" alt="Bathrooms Icon" />
                    <p className="label">Bathrooms</p>
                  </div>
                  <p className="value">3</p>
                </div> */}
              </div>
            </div>

            {/* Description */}
            <div className="description-box">
              <details>
                <summary>Description Overview</summary>
                <p style={{ whiteSpace: "pre-line" }}>{land.description}</p>
              </details>
            </div>

            {/* Security Guidelines */}
            <div className="description-box">
              <details>
                <summary>Security Guidelines</summary>
                <p>
                  Do not make any payments to advertiser before inspecting the
                  land. IntelliProp shall not be held responsible for any
                  transaction or agreement reached between the advertiser and
                  you.
                </p>
              </details>
            </div>

            {/*recommendations*/}
          </div>

          {/* RIGHT SIDE: PRICE + CONTACT */}
          <div className="right-section-land">
            {/* PRICE CARD */}
            <div className="price-card">
              <div className="price-info">
                {land.allow_bidding === 1 ? (
                  <>
                    <p className="start-price">
                      Starting Price: LKR{" "}
                      {Number(land.price_per_perch).toLocaleString()}
                    </p>
                    <h2 className="price-main">
                      LKR{" "}
                      {Number(
                        land.current_highest_bid || land.price_per_perch
                      ).toLocaleString()}
                      <span className="perch">/ PERCH</span>
                    </h2>
                    <p className="negotiable">Latest Bid</p>
                    <div className="bid-status-row">
                      
                      {land.auction_end && (
                        <span
                          className={`timer-text ${isExpired ? "expired" : ""}`}
                        >
                          Remaining Time:{timeLeft}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="price-main start-price">
                      LKR {Number(land.price_per_perch).toLocaleString()}{" "}
                      <span className="perch">/ PERCH</span>
                    </h2>
                    {/* You can optionally add a "Fixed Price" label here if desired */}
                  </>
                )}
              </div>

              {land.allow_bidding === 1 &&
              !isExpired &&
              land.auction_status === "Active" ? (
                <>
                  {!token && (
                    <p className="login-warning">
                      <Link to="/login">Login</Link> or{" "}
                      <Link to="/register">Register</Link> to place a bid
                    </p>
                  )}
                  <div className="bid-box bid-input-box">
                    <input
                      type="number"
                      id="userBid"
                      placeholder="Enter amount in Rs."
                      className="bid-input"
                      value={userBid}
                      onChange={(e) => setUserBid(e.target.value)}
                      disabled={!token || isSubmitting}
                    />
                  </div>

                  <button
                    className="button bid-btn"
                    onClick={handlePlaceBid}
                    disabled={!token || isSubmitting || !userBid}
                  >
                    {isSubmitting ? "Processing..." : "Place Bid"}
                  </button>
                </>
              ) : land.allow_bidding === 1 ? (
                <div className="closed-auction-msg">Auction has Ended</div>
              ) : (
                <div className="fixed-price-tag">
                  <p
                    style={{
                      color: "var(--primary)",
                      fontSize: "0.9rem",
                      marginTop: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    * Bidding is not available for this ad.
                  </p>
                </div>
              )}
              <div className="detail-box">
                <div className="detail-row">
                  <span>Category</span> <strong>Land</strong>
                </div>
                {/* <div className="detail-row">
                  <span>Type</span> <strong>Sale</strong>
                </div> */}
                <div className="detail-row">
                  <span>City</span> <strong>{land.city}</strong>
                </div>
                {/* <div className="detail-row">
                  <span>User Verified</span>{" "}
                  <strong>{land.is_email_verified ? "Yes" : "No"}</strong>
                </div> */}
                <p className="ref ref-published">
                  Published: {new Date(land.updated_at).toLocaleDateString()}
                </p>
                <p className="ref">Ref: W2776032510130654541321</p>
              </div>
            </div>

            {/* CONTACT CARD */}
            <div className="contact-card" onClick={() => setShowMobile(true)}>
              <p className="masked-number">
                +94{" "}
                {showMobile
                  ? land.seller_mobile
                  : land.seller_mobile.replace(/\d(?=\d{0})/g, "x")}
              </p>
              <p className="reveal-text">
                {showMobile ? "Seller Contact" : "Click to reveal number"}
              </p>

              <div className="contact-buttons">
                <button
                  className="whatsapp-btn"
                  onClick={() =>
                    window.open(`https://wa.me/${land.seller_mobile}`)
                  }
                >
                  <FaWhatsapp /> Chat on Whatsapp
                </button>
                <button className="owner-btn">Chat with Owner</button>
              </div>
            </div>

            {/* SHARE SECTION */}
            <div className="share-card">
              <p>Share this ad</p>

              <div className="share-icons">
                <FaFacebookF className="share-icon" />
                <FaTwitter className="share-icon" />
                <FaInstagram className="share-icon" />
                <FaYoutube className="share-icon" />
              </div>

              <button className="button save-btn">
                <FaHeart className="heart save-heart" /> Save
              </button>
            </div>
          </div>
        </div>

        {/* Similar Ads */}
        <div className="similar-section innerWidth paddings">
          <h3>Recommendations for You</h3>
          <Swiper {...sliderSetting}>
            <SlideNextButton />

            {/* slider */}
            {data.map((card, i) => (
              <SwiperSlide key={i}>
                <div className="flexColStart r-card card-bg">
                  <img src={card.image} alt="home" />

                  {/* Price + Heart Icon */}
                  <div className="r-top-row">
                    <span className="secondaryText r-price">
                      <span style={{ color: "var(--primary)" }}>$</span>
                      <span>{card.price}</span>
                    </span>

                    <FaHeart
                      className={`heart-icon ${
                        favorites.includes(i) ? "active" : ""
                      }`}
                      onClick={() => toggleFavorite(i)}
                    />
                  </div>

                  <span className="primaryText">{card.name}</span>
                  <span className="secondaryText">{card.detail}</span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <GetStarted />
      <Footer />
    </>
  );
};

export default LandDetails;

const SlideNextButton = () => {
  const swiper = useSwiper();
  return (
    <div className="flexCenter r-buttons">
      <button onClick={() => swiper.slidePrev()} className="r-prevButton">
        &lt;
      </button>
      <button onClick={() => swiper.slideNext()} className="r-nextButton">
        &gt;
      </button>
    </div>
  );
};
