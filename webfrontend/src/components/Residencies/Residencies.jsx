import React, { useState } from "react";
import data from "../../utils/slider.json";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import "./Residencies.css";
import { sliderSettings } from "../../utils/common";
import { FaHeart } from "react-icons/fa";

const Residencies = () => {
  
  // Track favorite status for each card
  const [favorites, setFavorites] = useState([]);

  // Toggle heart color on click
  const toggleFavorite = (index) => {
    setFavorites((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };
    
  return (
    <div id="residencies" className="r-wrapper">
      <div className="paddings innerWidth r-container">
        <div className="flexColStart r-head">
          <span className="blueText">Best Choices</span>
          <span className="primaryText">Popular Residencies</span>
        </div>

        <Swiper {...sliderSettings}>
          <SlideNextButton />

          {/* slider */}
          {data.map((card, i) => (
            <SwiperSlide key={i}>
              <div className="flexColStart r-card">
                <img src={card.image} alt="home" />

                {/* Price + Heart Icon */}
                <div className="r-top-row">
                  <span className="secondaryText r-price">
                    <span style={{ color: "var(--primary)" }}>$</span>
                    <span>{card.price}</span>
                  </span>

                  <FaHeart
                    className={`heart-icon ${favorites.includes(i) ? "active" : ""}`}
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
  )
}

export default Residencies

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