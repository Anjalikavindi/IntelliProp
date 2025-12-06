import React, { useState } from "react";
import Header from "../../components/Header/Header";
import GetStarted from "../../components/GetStarted/GetStarted";
import Footer from "../../components/Footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./PostAds.css";

const AdDetails = () => {
  const navigate = useNavigate();

  const user_id = localStorage.getItem("userId");

  const [propertyCategory, setPropertyCategory] = useState("");
  const [allowBidding, setAllowBidding] = useState(false);

  // Common fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [locationType] = useState("Rural");
  const [images, setImages] = useState(Array(6).fill(null));

  // House fields
  const [house, setHouse] = useState({
    ad_type: "",
    land_size: "",
    area_sqft: "",
    floors: "",
    bedrooms: "",
    bathrooms: "",
    price: "",
    negotiable: false,
  });

  // Land fields
  const [land, setLand] = useState({
    land_type: "",
    land_size: "",
    price_per_perch: "",
  });

  // Auction fields
  const [startingPrice, setStartingPrice] = useState("");
  const [auctionEndDateTime, setAuctionEndDateTime] = useState("");

  // RESET FORM FUNCTION
  const resetForm = () => {
    setPropertyCategory("");
    setAllowBidding(false);

    setTitle("");
    setDescription("");
    setCity("");
    setImages(Array(6).fill(null));

    setHouse({
      ad_type: "",
      land_size: "",
      area_sqft: "",
      floors: "",
      bedrooms: "",
      bathrooms: "",
      price: "",
      negotiable: false,
    });

    setLand({
      land_type: "",
      land_size: "",
      price_per_perch: "",
    });

    setStartingPrice("");
    setAuctionEndDateTime("");
  };

  // Submit Handler
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Not Logged In",
        text: "Please log in first.",
      });
      navigate("/login");
      return;
    }

    // Validate required fields
    if (!title || !description || !city || !propertyCategory) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all required fields.",
        confirmButtonColor: "#ab9272",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("city", city);
      formData.append("location_type", locationType);
      formData.append("property_category", propertyCategory);

      formData.append("house_details", JSON.stringify(house));
      formData.append("land_details", JSON.stringify(land));

      const auction_details = {
        startingPrice,
        auctionEndDateTime,
      };

      formData.append("allow_bidding", allowBidding);
      formData.append("auction_details", JSON.stringify(auction_details));

      images.forEach((img) => {
        if (img) formData.append("images", img);
      });

      const res = await fetch("http://localhost:5000/api/ads/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      // Check if response is not OK
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({})); // handle invalid JSON
        Swal.fire({
          icon: "error",
          title: `Error ${res.status}`,
          text:
            errorData.message || "Something went wrong while posting the ad.",
        });
        return;
      }

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Ad Created!",
          text: "Your ad has been successfully posted.",
          confirmButtonColor: "#000",
        }).then(() => {
          resetForm(); // Reset all fields
          navigate("/postyourad"); //Redirect
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.message || "Could not create ad.",
        });
      }
    } catch (error) {
      console.error("Create Ad Error:", error);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong while posting the ad.",
      });
    }
  };

  return (
    <>
      <Header />
      {/* Breadcrumb */}
      <div
        className="breadcrumb-section"
        style={{ backgroundImage: `url('/ads-bg.jpg')` }}
      >
        <div className="breadcrumb-content">
          <h2>Post Your Ad</h2>
          <p>
            <Link to="/" className="breadcrumb-link">
              Home
            </Link>{" "}
            <Link to="/verifyyournumber" className="breadcrumb-link">
              / verify
            </Link>{" "}
            / Post Your Ad
          </p>
        </div>
      </div>

      <div className="ad-content blue-bg">
        <div className="ads-container innerWidth paddings">
          <div className="process-header">
            <h1 className="process-title">Complete the Details to Proceed</h1>
            <p className="ads-subtext process-subtext">
              Easily showcase your product or service to a wide audience. Upload
              photos, videos, and detailed descriptions to create an engaging
              listing. With our user-friendly platform, posting is quick and
              simple.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="progress-wrapper">
            <div className="steps">
              <div className="step active">
                <span>
                  <img
                    src="/icons/verify.png"
                    alt="Verify Icon"
                    className="ads-icon"
                  />
                </span>
                <p className="process-subtext">Verify</p>
              </div>
              <div className="l-complete line"></div>
              <div className="step active">
                <span>
                  <img
                    src="/icons/add-post.png"
                    alt="Verify Icon"
                    className="detail-icon ads-icon"
                  />
                </span>
                <p className="process-subtext">Ad Detail</p>
              </div>
            </div>
          </div>

          <div className="postads-layout">
            {/* LEFT COLUMN FORM */}
            <div className="left-section">
              {/* HEADING + DESCRIPTION */}
              <div className="form-box">
                <div className="form-group">
                  <label>Heading</label>
                  <input
                    type="text"
                    placeholder="Enter your ad title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Write details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option>Select a city</option>
                    <option>Colombo</option>
                    <option>Kandy</option>
                    <option>Galle</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Location Type</label>
                  <input
                    type="text"
                    value="Rural"
                    placeholder="Location type will appear here"
                    readOnly
                  />
                </div>
              </div>

              {/* PROPERTY INFORMATION */}
              <div className="form-box">
                <h3>Property Information</h3>

                <div className="form-group">
                  <label className="radio-btn-label">Property Category</label>
                  <div className="category-options">
                    <label>
                      <input
                        type="radio"
                        name="pc"
                        value="House"
                        onChange={() => {
                          setPropertyCategory("House");
                          setAllowBidding(false);
                        }}
                      />{" "}
                      House
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="pc"
                        value="Land"
                        onChange={() => setPropertyCategory("Land")}
                      />{" "}
                      Land
                    </label>
                  </div>

                  {/*House Details*/}
                  {propertyCategory === "House" && (
                    <div>
                      <div className="form-group">
                        <label>Ad Type</label>
                        <select
                          value={house.ad_type}
                          onChange={(e) =>
                            setHouse({ ...house, ad_type: e.target.value })
                          }
                        >
                          <option>Select an ad type</option>
                          <option>For Sale</option>
                          <option>For Rent</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Land Size (in Perch)</label>
                        <input
                          type="number"
                          value={house.land_size}
                          onChange={(e) =>
                            setHouse({ ...house, land_size: e.target.value })
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>Area (Square Feet)</label>
                        <input
                          type="number"
                          value={house.area_sqft}
                          onChange={(e) =>
                            setHouse({ ...house, area_sqft: e.target.value })
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>Floors</label>
                        <input
                          type="number"
                          value={house.floors}
                          onChange={(e) =>
                            setHouse({ ...house, floors: e.target.value })
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>Bedrooms</label>
                        <input
                          type="number"
                          value={house.bedrooms}
                          onChange={(e) =>
                            setHouse({ ...house, bedrooms: e.target.value })
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>Bathrooms</label>
                        <input
                          type="number"
                          value={house.bathrooms}
                          onChange={(e) =>
                            setHouse({ ...house, bathrooms: e.target.value })
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>Price (LKR)</label>
                        <input
                          type="number"
                          value={house.price}
                          onChange={(e) =>
                            setHouse({ ...house, price: e.target.value })
                          }
                        />
                      </div>

                      <div className="form-group negotiable-wrap">
                        <label>
                          <input
                            type="checkbox"
                            checked={house.negotiable}
                            onChange={(e) =>
                              setHouse({
                                ...house,
                                negotiable: e.target.checked,
                              })
                            }
                          />{" "}
                          Negotiable
                        </label>
                      </div>
                    </div>
                  )}

                  {/* ----- LAND DETAILS ----- */}
                  {propertyCategory === "Land" && (
                    <div>
                      <div className="form-group">
                        <label>Land Type</label>
                        <select
                          value={land.land_type}
                          onChange={(e) =>
                            setLand({ ...land, land_type: e.target.value })
                          }
                        >
                          <option>Select land type</option>
                          <option>Agricultural</option>
                          <option>Commercial</option>
                          <option>Residential</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Land Size (in Perch)</label>
                        <input
                          type="number"
                          value={land.land_size}
                          onChange={(e) =>
                            setLand({ ...land, land_size: e.target.value })
                          }
                        />
                      </div>

                      {/* ✅ SINGLE PRICE FIELD FOR LAND */}
                      <div className="form-group">
                        <label>Price per Perch(LKR)</label>
                        <input
                          type="number"
                          value={land.price_per_perch}
                          onChange={(e) =>
                            setLand({
                              ...land,
                              price_per_perch: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="form-group negotiable-wrap">
                        <label>
                          <input
                            type="checkbox"
                            checked={allowBidding}
                            onChange={(e) => setAllowBidding(e.target.checked)}
                          />{" "}
                          Allow bidding for land
                        </label>
                        <p className="note-text">
                          Tick this option if you want buyers to place bids for
                          it.
                        </p>
                      </div>

                      {/* ---------- AUCTION FIELDS ---------- */}
                      {allowBidding && (
                        <div className="auction-box">
                          <h3>Auction Details</h3>

                          <div className="form-group">
                            <label>Starting Bid Price (LKR)</label>
                            <input
                              type="number"
                              placeholder="Enter starting bid"
                              value={startingPrice}
                              onChange={(e) => setStartingPrice(e.target.value)}
                            />
                          </div>

                          {/* NEW: Custom Auction End Date & Time */}
                          <div className="form-group">
                            <label>Auction End Date & Time</label>
                            <input
                              type="datetime-local"
                              value={auctionEndDateTime}
                              onChange={(e) =>
                                setAuctionEndDateTime(e.target.value)
                              }
                            />
                          </div>

                          <p className="note-text">
                            The auction will automatically close after the
                            selected time.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* AD IMAGES SECTION */}
              <div className="form-box">
                <h3>Ad Images</h3>

                <div className="images-grid">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="image-box"
                      onClick={() =>
                        document.getElementById(`img-input-${index}`).click()
                      }
                    >
                      {/* If image preview exists */}
                      {img ? (
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`preview-${index}`}
                          className="preview-img"
                        />
                      ) : (
                        <span>Add Media</span>
                      )}

                      {/* Hidden input field */}
                      <input
                        type="file"
                        id={`img-input-${index}`}
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const newImages = [...images];
                            newImages[index] = file;
                            setImages(newImages);
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>

                <p className="note-text">
                  Drag to reorder images. First image becomes your listing
                  thumbnail. At least 1 image is required.
                </p>
              </div>

              {/* SUBMIT BUTTON */}
              <button className="button-2 post-btn" onClick={handleSubmit}>
                Post Your Ad
              </button>
            </div>
          </div>
        </div>
      </div>
      <GetStarted />
      <Footer />
    </>
  );
};

export default AdDetails;
