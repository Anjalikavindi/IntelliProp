import React, { useState } from "react";
import Header from "../../components/Header/Header";
import GetStarted from "../../components/GetStarted/GetStarted";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import data from "../../utils/slider.json";
import { sliderSetting } from "../../utils/houseRecommendations";
import {
  FaHeart,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import "./HouseDetail.css";

const HouseDetail = () => {
  
  // Track favorite status for each card
  const [favorites, setFavorites] = useState([]);

  // Toggle heart color on click
  const toggleFavorite = (index) => {
    setFavorites((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <>
      <Header />

      {/* Breadcrumb */}
      <div
        className="breadcrumb-section"
        style={{ backgroundImage: `url('/residencies-bg.jpg')` }}
      >
        <div className="breadcrumb-content">
          <h2>House for Sale in Kandy</h2>
          <p>
            <Link to="/" className="breadcrumb-link">
              Home
            </Link>{" "}
            /{" "}
            <Link to="/residencies" className="breadcrumb-link">
              Residencies
            </Link>{" "}
            / House for Sale in Kandy
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="detail-wrapper blue-bg">
        <div className="house-detail innerWidth paddings">
          {/* LEFT SIDE: IMAGES + DESCRIPTION */}
          <div className="left-section">
            {/* Main Image */}
            <div className="main-image">
              <img src="/r1.png" alt="House" />
              <span className="image-count">1/6</span>
            </div>

            {/* Thumbnail Images */}
            <div className="thumbnail-row">
              <img src="/r2.png" alt="" />
              <img src="/r3.png" alt="" />
              <img src="/r1.png" alt="" />
              <img src="/r2.png" alt="" />
              <img src="/r3.png" alt="" />
              <img src="/r1.png" alt="" />
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
                  <p className="value">10 Perches</p>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <img src="/icons/size.png" alt="Area Icon" />
                    <p className="label">Area (sqft)</p>
                  </div>
                  <p className="value">0000</p>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <img src="/icons/bedroom.png" alt="Bedrooms Icon" />
                    <p className="label">Bedrooms</p>
                  </div>
                  <p className="value">3</p>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <img src="/icons/bath.png" alt="Bathrooms Icon" />
                    <p className="label">Bathrooms</p>
                  </div>
                  <p className="value">3</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="description-box">
              <details>
                <summary>Description Overview</summary>
                <p>
                  Luxury house available for sale in Kandy, Peradeniya.
                  <br />
                  10 perch
                  <br />3 bedroom and 3 bathroom
                  <br />
                  Kitchen with pantry
                  <br />
                  Living and dining area
                  <br />
                  Rooms and balconies
                  <br />
                  Large rooftop
                  <br />5 km to Peradeniya
                  <br />
                  45 million
                  <br />
                  0775526690
                </p>
              </details>
            </div>

            {/* Security Guidelines */}
            <div className="description-box">
              <details>
                <summary>Security Guidelines</summary>
                <p>
                  Always inspect the property in person before making payments.
                </p>
              </details>
            </div>
          </div>

          {/* RIGHT SIDE: PRICE + CONTACT */}
          <div className="right-section">
            {/* PRICE CARD */}
            <div className="price-card">
              <h2 className="price-main">
                Rs: 2,500,000
              </h2>
              <p className="negotiable">Negotiable</p>

              <div className="detail-box">
                <div className="detail-row">
                  <span>Category</span> <strong>House</strong>
                </div>
                <div className="detail-row">
                  <span>Type</span> <strong>Sale</strong>
                </div>
                <div className="detail-row">
                  <span>Area (square feet)</span> <strong>544.5</strong>
                </div>
                <p className="ref">Ref: W2776032510130654541321</p>
              </div>
            </div>

            {/* CONTACT CARD */}
            <div className="contact-card">
              <p className="masked-number">+94 7xxxxxxxx</p>
              <p className="reveal-text">Click to reveal</p>

              <div className="contact-buttons">
                <button className="whatsapp-btn">Chat on Whatsapp</button>
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
  )
}

export default HouseDetail

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