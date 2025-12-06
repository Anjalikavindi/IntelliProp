import db from "../../config/db.js";

// Helper: convert undefined → null
function cleanObject(obj) {
  if (!obj) return null;
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined || obj[key] === "undefined") {
      obj[key] = null;
    }
  });
  return obj;
}

// Helper function to wrap db.execute in a Promise
const executeQuery = (query, values) => {
  return new Promise((resolve, reject) => {
    db.execute(query, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

export const createAd = async (req, res) => {
  try {
    let {
      title,
      description,
      city,
      location_type,
      property_category,
      house_details,
      land_details,
      allow_bidding,
      auction_details,
    } = req.body;

    const user_id = req.userId;

    if (!property_category) {
      return res.status(400).json({
        success: false,
        message: "Please select a Property Category.",
      });
    }

    // Convert JSON strings → objects
    house_details = house_details
      ? cleanObject(JSON.parse(house_details))
      : null;
    land_details = land_details ? cleanObject(JSON.parse(land_details)) : null;
    auction_details =
      allow_bidding === "true" || allow_bidding === true
        ? cleanObject(JSON.parse(auction_details))
        : null;

    // Convert allow_bidding to number (0/1)
    const allowBiddingValue =
      allow_bidding === "true" || allow_bidding === true ? 1 : 0;

    // 2️⃣ Required fields for House
    if (property_category === "House") {
      const requiredHouseFields = [
        "ad_type",
        "land_size",
        "area_sqft",
        "floors",
        "bedrooms",
        "bathrooms",
        "price",
      ];

      for (let field of requiredHouseFields) {
        if (!house_details || !house_details[field]) {
          return res.status(400).json({
            success: false,
            message: "Please fill all required House details.",
          });
        }
      }
    }

    // 3️⃣ Required fields for Land
    if (property_category === "Land") {
      const requiredLandFields = ["land_type", "land_size", "price_per_perch"];
      for (let field of requiredLandFields) {
        if (!land_details || !land_details[field]) {
          return res.status(400).json({
            success: false,
            message: "Please fill all required Land details.",
          });
        }
      }

      // If bidding is allowed, starting price and auction end must be provided
      if (allowBiddingValue) {
        if (
          !auction_details ||
          !auction_details.startingPrice ||
          !auction_details.auctionEndDateTime
        ) {
          return res.status(400).json({
            success: false,
            message: "Please fill all required Auction details.",
          });
        }
      }
    }

    // 4️⃣ At least one image should be uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image for the ad.",
      });
    }

    // -----------------------------
    // 1️⃣ INSERT INTO ADS TABLE
    // -----------------------------
    const adQuery = `
      INSERT INTO ads 
      (user_id, title, description, city, location_type, property_category, publish_status)
      VALUES (?, ?, ?, ?, ?, ?, 'Pending')
    `;

    const adResult = await executeQuery(adQuery, [
      user_id,
      title,
      description,
      city,
      location_type,
      property_category,
    ]);

    const ad_id = adResult.insertId;

    // -----------------------------
    // 2️⃣ INSERT HOUSE DETAILS (if House)
    // -----------------------------
    if (property_category === "House" && house_details) {
      const houseQuery = `
        INSERT INTO house_details 
        (ad_id, land_size, area_sqft, floors, bedrooms, bathrooms, price, negotiable, ad_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await executeQuery(houseQuery, [
        ad_id,
        house_details.land_size,
        house_details.area_sqft,
        house_details.floors,
        house_details.bedrooms,
        house_details.bathrooms,
        house_details.price,
        house_details.negotiable ? 1 : 0,
        house_details.ad_type,
      ]);
    }

    // -----------------------------
    // 3️⃣ INSERT LAND DETAILS
    // -----------------------------
    if (property_category === "Land" && land_details) {
      const landQuery = `
        INSERT INTO land_details
        (ad_id, land_type, land_size, price_per_perch, allow_bidding)
        VALUES (?, ?, ?, ?, ?)
      `;

      await executeQuery(landQuery, [
        ad_id,
        land_details.land_type,
        land_details.land_size,
        land_details.price_per_perch,
        allowBiddingValue,
      ]);
    }

    // -----------------------------
    // 4️⃣ INSERT AUCTION DETAILS (if bidding)
    // -----------------------------
    if (allowBiddingValue === 1 && auction_details) {
      const auctionQuery = `
        INSERT INTO auction_details
        (ad_id, starting_price, auction_end)
        VALUES (?, ?, ?)
      `;

      await executeQuery(auctionQuery, [
        ad_id,
        auction_details.startingPrice,
        auction_details.auctionEndDateTime,
      ]);
    }

    // -----------------------------
    // ⭐ SAVE IMAGES
    // -----------------------------

    if (req.files && req.files.length > 0) {
      const imageQuery = `
        INSERT INTO ad_images (ad_id, image_path, is_thumbnail)
        VALUES (?, ?, ?)
      `;

      for (let i = 0; i < req.files.length; i++) {
        await executeQuery(imageQuery, [
          ad_id,
          req.files[i].filename,
          i === 0 ? 1 : 0, // first image is thumbnail
        ]);
      }
    }

    // -----------------------------
    // ⭐ SUCCESS RESPONSE
    // -----------------------------
    return res.status(201).json({
      success: true,
      message: "Ad created successfully",
      ad_id,
    });
  } catch (error) {
    console.error("Create Ad Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating ad",
    });
  }
};
