import React, { useState, useEffect } from "react";
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
  const [districtId, setDistrictId] = useState("");
  const [district, setDistrict] = useState("");
  const [districts, setDistricts] = useState([]);
  const [subArea, setSubArea] = useState("");
  const [areas, setAreas] = useState([]);
  const [images, setImages] = useState(Array(6).fill(null));

  // House fields
  const [house, setHouse] = useState({
    ad_type: "",
    land_size: "",
    area_sqft: "",
    floors: "",
    bedrooms: "",
    bathrooms: "",
    year_built: "",
    water_supply: "",
    electricity_type: "",
    parking_spots: 0,
    has_garden: false,
    has_ac: false,
    negotiable: false,
  });

  const [predictedPrice, setPredictedPrice] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);

  // Land fields
  const [land, setLand] = useState({
    land_type: "",
    land_size: "",
    price_per_perch: "",
  });

  // Auction fields
  const [startingPrice, setStartingPrice] = useState("");
  const [auctionEndDateTime, setAuctionEndDateTime] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/districts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDistricts(data.districts);
        }
      })
      .catch((err) => console.error("Error fetching districts:", err));
  }, []);

  useEffect(() => {
    if (!districtId) {
      setAreas([]);
      return;
    }

    fetch(`http://localhost:5000/api/areas/${districtId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAreas(data.areas);
        }
      })
      .catch((err) => console.error("Error fetching areas:", err));
  }, [districtId]);

  // RESET FORM FUNCTION
  const resetForm = () => {
    setPropertyCategory("");
    setAllowBidding(false);

    setTitle("");
    setDescription("");
    setDistrict("");
    setImages(Array(6).fill(null));

    setPredictedPrice(null);
    setIsPredicting(false);

    setHouse({
      ad_type: "",
      land_size: "",
      area_sqft: "",
      floors: "",
      bedrooms: "",
      bathrooms: "",
      year_built: "",
      water_supply: "",
      electricity_type: "",
      parking_spots: 0,
      has_garden: false,
      has_ac: false,
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

  //House Price Prediction
  const handlePredictPrice = async () => {
    // Validation
    if (
      !house.land_size ||
      !house.area_sqft ||
      !house.floors ||
      !house.bedrooms ||
      !house.bathrooms ||
      !house.year_built ||
      !house.water_supply ||
      !house.electricity_type
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing House Details",
        text: "Please fill required house details before prediction.",
      });
      return;
    }

    try {
      setIsPredicting(true);

      const response = await fetch(
        "http://localhost:5000/api/predict/house-price",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            district: district,
            area: subArea,

            perch: Number(house.land_size),
            bedrooms: Number(house.bedrooms),
            bathrooms: Number(house.bathrooms),
            kitchen_area_sqft: Number(house.area_sqft),
            parking_spots: Number(house.parking_spots),
            has_garden: house.has_garden ? 1 : 0,
            has_ac: house.has_ac ? 1 : 0,
            water_supply: house.water_supply,
            electricity: house.electricity_type,
            floors: Number(house.floors),
            year_built: Number(house.year_built),
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setPredictedPrice(data.predicted_price);
      } else {
        Swal.fire({
          icon: "error",
          title: "Prediction Failed",
          text: data.message || "Could not generate prediction.",
        });
      }
    } catch (error) {
      console.error("Prediction error:", error);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Prediction service unavailable.",
      });
    } finally {
      setIsPredicting(false);
    }
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
    if (!title || !description || !district || !subArea || !propertyCategory) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all required fields.",
        confirmButtonColor: "#ab9272",
      });
      return;
    }

    if (propertyCategory === "House" && (!predictedPrice || predictedPrice <= 0)) {
      Swal.fire({
        icon: "warning",
        title: "Generate Price First",
        text: "Please generate the predicted price before posting.",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("district", district);
      formData.append("area", subArea);
      formData.append("property_category", propertyCategory);

      formData.append("house_details", JSON.stringify(house));
      formData.append("land_details", JSON.stringify(land));
      formData.append("price", Number(predictedPrice));

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
                  <label>District</label>
                  <select
                    value={districtId}
                    onChange={(e) => {
                      const selectedDistrict = districts.find(
                        (d) => d.district_id === Number(e.target.value), // ensure number
                      );
                      if (selectedDistrict) {
                        setDistrictId(selectedDistrict.district_id); // for fetching areas
                        setDistrict(selectedDistrict.district_name); // for submission
                        setSubArea(""); // reset sub area
                      } else {
                        setDistrictId("");
                        setDistrict("");
                        setSubArea("");
                      }
                    }}
                  >
                    <option value="">Select a district</option>
                    {districts.map((d) => (
                      <option key={d.district_id} value={d.district_id}>
                        {d.district_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Sub Area</label>
                  <select
                    value={subArea}
                    onChange={(e) => setSubArea(e.target.value)}
                    disabled={!district}
                  >
                    <option value="">Select a sub area</option>
                    {areas.map((area) => (
                      <option key={area.area_id} value={area.area_name}>
                        {area.area_name}
                      </option>
                    ))}
                  </select>
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
                        <label>Year Built</label>
                        <input
                          type="number"
                          value={house.year_built}
                          onChange={(e) =>
                            setHouse({ ...house, year_built: e.target.value })
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>Water Supply</label>
                        <select
                          value={house.water_supply}
                          onChange={(e) =>
                            setHouse({ ...house, water_supply: e.target.value })
                          }
                        >
                          <option value="">Select</option>
                          <option>Pipe-borne</option>
                          <option>Well</option>
                          <option>Both</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Electricity Type</label>
                        <select
                          value={house.electricity_type}
                          onChange={(e) =>
                            setHouse({
                              ...house,
                              electricity_type: e.target.value,
                            })
                          }
                        >
                          <option value="">Select</option>
                          <option>Single Phase</option>
                          <option>Three Phase</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Parking Spots</label>
                        <select
                          value={house.parking_spots}
                          onChange={(e) =>
                            setHouse({
                              ...house,
                              parking_spots: e.target.value,
                            })
                          }
                        >
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </select>
                      </div>

                      <div className="form-group negotiable-wrap">
                        <label>
                          <input
                            type="checkbox"
                            checked={house.has_garden}
                            onChange={(e) =>
                              setHouse({
                                ...house,
                                has_garden: e.target.checked,
                              })
                            }
                          />
                          Garden Availability
                        </label>
                      </div>

                      <div className="form-group negotiable-wrap">
                        <label>
                          <input
                            type="checkbox"
                            checked={house.has_ac}
                            onChange={(e) =>
                              setHouse({ ...house, has_ac: e.target.checked })
                            }
                          />
                          A/C Availability
                        </label>
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

                      {/* -------- PRICE PREDICTION SECTION -------- */}
                      <div className="prediction-box">
                        {predictedPrice && (
                          <div
                            className="predicted-price-display"
                            style={{ marginBottom: "15px" }}
                          >
                            <label>AI Predicted Market Price (LKR)</label>
                            <input
                              type="number"
                              className="predicted-price-input"
                              value={predictedPrice}
                              onChange={(e) =>
                                setPredictedPrice(e.target.value)
                              }
                            />

                            <p className="note-text">
                              You can adjust this price if needed before
                              posting.
                            </p>
                          </div>
                        )}

                        <button
                          type="button"
                          className="button-2"
                          onClick={handlePredictPrice}
                          disabled={isPredicting}
                        >
                          {isPredicting
                            ? "Generating Price..."
                            : "Generate Predicted Price"}
                        </button>
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
