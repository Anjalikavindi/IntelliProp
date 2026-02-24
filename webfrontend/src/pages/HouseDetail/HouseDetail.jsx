import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header/Header";
import GetStarted from "../../components/GetStarted/GetStarted";
import Footer from "../../components/Footer/Footer";
import { useParams, Link } from "react-router-dom";
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
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [showNumber, setShowNumber] = useState(false);

  // Track favorite status for each card
  const [favorites, setFavorites] = useState([]);

  // Toggle heart color on click
  const toggleFavorite = (index) => {
    setFavorites((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/ads/published-houses/${id}`,
        );
        setHouse(res.data);
        setSelectedImage(res.data.images[0]);
      } catch (err) {
        console.error("Error fetching house:", err);
      }
    };

    fetchHouse();
  }, [id]);

  const formattedNumber = house?.mobile
    ? house.mobile.startsWith("0")
      ? `+94 ${house.mobile.substring(1)}`
      : `+94 ${house.mobile}`
    : "";

  // Mask last 9 digits
  const maskedNumber = formattedNumber
    ? formattedNumber.substring(0, formattedNumber.length - 9) + "xxxxxxxxx"
    : "";

  if (!house) return <div>Loading...</div>;

  return (
    <>
      <Header />

      {/* Breadcrumb */}
      <div
        className="breadcrumb-section"
        style={{ backgroundImage: `url('/residencies-bg.jpg')` }}
      >
        <div className="breadcrumb-content">
          <h2>{house.title}</h2>
          <p>
            <Link to="/" className="breadcrumb-link">
              Home
            </Link>{" "}
            /{" "}
            <Link to="/residencies" className="breadcrumb-link">
              Residencies
            </Link>{" "}
            / {house.title}
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
              <img src={selectedImage} alt="House" />
              <span className="image-count">1/6</span>
            </div>

            {/* Thumbnail Images */}
            <div className="thumbnail-row">
              {house.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt=""
                  onClick={() => setSelectedImage(img)}
                  style={{ cursor: "pointer" }}
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
                  <p className="value">{house.ad_type}</p>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <img src="/icons/land.png" alt="Land Icon" />
                    <p className="label">Land Size</p>
                  </div>
                  <p className="value">{house.land_size} Perches</p>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <img src="/icons/size.png" alt="Area Icon" />
                    <p className="label">Kitchen Area (sqft)</p>
                  </div>
                  <p className="value">{house.area_sqft}</p>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <img src="/icons/bedroom.png" alt="Bedrooms Icon" />
                    <p className="label">Bedrooms</p>
                  </div>
                  <p className="value">{house.bedrooms}</p>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <img src="/icons/bath.png" alt="Bathrooms Icon" />
                    <p className="label">Bathrooms</p>
                  </div>
                  <p className="value">{house.bathrooms}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="description-box">
              <details>
                <summary>Description Overview</summary>
                <p>{house.description}</p>
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
                Rs: {Number(house.price).toLocaleString()}
              </h2>
              {house.negotiable && <p className="negotiable">Negotiable</p>}

              <div className="detail-box">
                <div className="detail-row">
                  <span>Category</span> <strong>House</strong>
                </div>
                <div className="detail-row">
                  <span>Type</span> <strong>{house.ad_type}</strong>
                </div>
                <div className="detail-row">
                  <span>Kitchen Area (square feet)</span>{" "}
                  <strong>{house.area_sqft}</strong>
                </div>
                <p className="ref">
                  <strong>Posted:</strong>{" "}
                  {new Date(house.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* CONTACT CARD */}
            <div className="contact-card">
              <p
                className="masked-number"
                onClick={() => setShowNumber(true)}
                style={{ cursor: "pointer" }}
              >
                {showNumber ? formattedNumber : maskedNumber}
              </p>

              {!showNumber && <p className="reveal-text">Click to reveal</p>}

              <div className="contact-buttons">
                <button
                  className="whatsapp-btn"
                  onClick={() =>
                    window.open(`https://wa.me/${house.mobile}`)
                  }
                >
                  Chat on Whatsapp
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

export default HouseDetail;

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
