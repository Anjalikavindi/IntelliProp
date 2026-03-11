import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import "./Residencies.css";
import { sliderSettings } from "../../utils/common";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Residencies = () => {
  const [recentHouses, setRecentHouses] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/ads/published-houses");
        // Assuming the backend returns an array of houses
        // We take the first 8 for the slider
        setRecentHouses(res.data.houses.slice(0, 8));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching house ads:", err);
        setLoading(false);
      }
    };

    fetchHouses();
  }, []);

  const toggleFavorite = (id, e) => {
    e.stopPropagation(); // Prevents the card click event from firing
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (loading) return <div className="paddings innerWidth">Loading Recent Residencies...</div>;

  return (
    <div id="residencies" className="r-wrapper">
      <div className="paddings innerWidth r-container">
        <div className="flexColStart r-head">
          <span className="blueText">Best Choices</span>
          <span className="primaryText">Popular Residencies</span>
        </div>

        <Swiper {...sliderSettings}>
          <SlideNextButton />

          {recentHouses.map((card) => (
            <SwiperSlide key={card.ad_id}>
              {/* Using onClick + useNavigate to keep the CSS structure identical to your original code */}
              <div 
                className="flexColStart r-card"
                onClick={() => navigate(`/housedetails/${card.ad_id}`)}
              >
                {/* Dynamically loading the thumbnail from your server */}
                <img 
                  src={card.image_path ? `http://localhost:5000/images/${card.image_path}` : "/residencies-bg.jpg"} 
                  alt="home" 
                />

                <div className="r-top-row">
                  <span className="secondaryText r-price">
                    <span style={{ color: "var(--primary)" }}>LKR</span>
                    <span> {Number(card.price).toLocaleString()}</span>
                  </span>

                  <FaHeart
                    className={`heart-icon ${favorites.includes(card.ad_id) ? "active" : ""}`}
                    onClick={(e) => toggleFavorite(card.ad_id, e)}
                  />
                </div>

                <span className="primaryText">{card.title}</span>
                <span className="secondaryText">
                  {card.bedrooms} Bed | {card.bathrooms} Bath | {card.district}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Residencies;

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