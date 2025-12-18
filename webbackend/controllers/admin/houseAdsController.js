import db from "../../config/db.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
/**
 * @desc Fetch all House (Residency) ads with details for admin view.
 * @route GET /api/admin/ads/residencies
 * @access Private (Admin only)
 */
export const getHouseAdsList = async (req, res) => {
  const coreQuery = `
        SELECT 
            a.ad_id,                         
            hd.house_id AS id,
            a.title,
            a.city,
            a.description,
            a.created_at AS createdAt,
            a.publish_status AS publishedStatus,
            u.name AS sellerName,
            u.email AS sellerEmail,
            u.mobile AS sellerMobile,
            hd.land_size AS landSize,
            hd.area_sqft AS area,
            hd.floors,
            hd.bedrooms,
            hd.bathrooms,
            hd.price
        FROM 
            ads a
        JOIN 
            house_details hd ON a.ad_id = hd.ad_id
        JOIN 
            users u ON a.user_id = u.id
        WHERE 
            a.property_category = 'House'
        ORDER BY 
            a.created_at DESC;
    `;

  // 2. Query to fetch ALL images for ALL House ads
  const imagesQuery = `
        SELECT 
            ad_id, 
            image_path, 
            is_thumbnail
        FROM 
            ad_images
        WHERE 
            ad_id IN (SELECT ad_id FROM ads WHERE property_category = 'House')
        ORDER BY 
            ad_id, is_thumbnail DESC;
    `;

  try {
    // Execute both queries
    const [coreResults] = await db.promise().query(coreQuery);
    const [imageResults] = await db.promise().query(imagesQuery);

    // Map images to their respective ad IDs (keyed by ad_id)
    const adImagesMap = imageResults.reduce((acc, img) => {
      if (!acc[img.ad_id]) {
        acc[img.ad_id] = [];
      }

      const imageFileName = img.image_path || "";
      const fullPath = imageFileName
        ? `http://localhost:5000/images/${imageFileName}`
        : "/default-house.png";

      acc[img.ad_id].push({
        path: fullPath,
        isThumbnail: img.is_thumbnail,
      });
      return acc;
    }, {});

    // Map core results and attach images
    const houseAds = coreResults.map((ad) => {
      // **Crucially, we use ad.ad_id for looking up images.**
      const adIdForImages = ad.ad_id;

      // **ad.id is now hd.house_id for display purposes.**
      const houseIdForDisplay = ad.id;

      const images = adImagesMap[adIdForImages] || [];

      // Find the thumbnail path
      const thumbnailObj = images.find((img) => img.isThumbnail) || images[0];
      const thumbnailPath = thumbnailObj
        ? thumbnailObj.path
        : "/default-house.png";

      // Parse numeric fields for safe formatting
      const parsedLandSize =
        ad.landSize !== null ? parseFloat(ad.landSize) : null;
      const parsedArea = ad.area !== null ? parseFloat(ad.area) : null;
      const parsedPrice = ad.price !== null ? parseFloat(ad.price) : null;

      return {
        id: houseIdForDisplay,
        adId: adIdForImages,
        thumbnail: thumbnailPath,
        images: images,
        title: ad.title,
        city: ad.city,
        description: ad.description,
        sellerName: ad.sellerName,
        sellerEmail: ad.sellerEmail,
        sellerMobile: ad.sellerMobile,
        // Formatted values
        landSize: `${
          parsedLandSize !== null ? parsedLandSize.toFixed(2) : "N/A"
        } Perches`,
        area: `${parsedArea !== null ? parsedArea : "N/A"} sqft`,
        floors: ad.floors,
        bedrooms: ad.bedrooms,
        bathrooms: ad.bathrooms,
        price:
          parsedPrice !== null
            ? `LKR ${parsedPrice.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}`
            : "Negotiable",
        createdAt: new Date(ad.createdAt).toISOString().split("T")[0],
        publishedStatus: ad.publishedStatus,
      };
    });

    return res.json(houseAds);
  } catch (err) {
    console.error("Database error fetching house ads:", err);
    return res.status(500).json({
      message: "Error fetching residency advertisements from database.",
    });
  }
};

//Publish ads
export const publishAd = async (req, res) => {
  const { adId } = req.params;
  let adminId;

  // --- Start: Manual Token Check and Admin ID Extraction ---
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided." });
    }
    
    // Decode the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    // Extract the admin ID (assuming your token payload includes { id: admin.id, ... })
    adminId = decoded.id;

    if (!adminId) {
        return res.status(401).json({ message: "Admin ID missing in token payload." });
    }

  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({ message: "Not authorized, invalid token." });
  }
  // --- End: Manual Token Check and Admin ID Extraction ---

  if (!adId || isNaN(adId)) {
    return res.status(400).json({ message: "Invalid Ad ID." });
  }

  const updateQuery = `
        UPDATE ads
        SET 
            publish_status = 'Published',
            status_updated_by_admin_id = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE 
            ad_id = ?;
    `;

  try {
    // Execute the update query using the extracted adminId
    const [result] = await db.promise().query(updateQuery, [adminId, adId]);

    if (result.affectedRows === 0) {
      // Check if the ad exists but is already Published
      const checkStatusQuery = "SELECT publish_status FROM ads WHERE ad_id = ?";
      const [statusResult] = await db.promise().query(checkStatusQuery, [adId]);
      
      if (statusResult.length > 0 && statusResult[0].publish_status === 'Published') {
          return res.status(200).json({
              message: `Ad ${adId} is already Published. Updated admin ID and timestamp.`,
              status: "Published",
          });
      }

      return res.status(404).json({
        message:
          "Ad not found or it's not a House property.",
      });
    }

    res.status(200).json({
      message: `Ad ${adId} published successfully.`,
      status: "Published",
    });
  } catch (error) {
    console.error("Database error publishing ad:", error);
    res.status(500).json({ message: "Failed to update ad status in database." });
  }
};


//Reject ads
export const rejectAd = async (req, res) => { // <<< NEW FUNCTION
    const { adId } = req.params;
    let adminId;

    // --- Start: Manual Token Check and Admin ID Extraction ---
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token provided." });
        }
        
        // Decode the token using the secret key
        const decoded = jwt.verify(token, JWT_SECRET);
        adminId = decoded.id;

        if (!adminId) {
            return res.status(401).json({ message: "Admin ID missing in token payload." });
        }

    } catch (error) {
        console.error("JWT verification failed:", error.message);
        return res.status(401).json({ message: "Not authorized, invalid token." });
    }
    // --- End: Manual Token Check and Admin ID Extraction ---

    if (!adId || isNaN(adId)) {
        return res.status(400).json({ message: "Invalid Ad ID." });
    }

    const updateQuery = `
        UPDATE ads
        SET 
            publish_status = 'Rejected',  
            status_updated_by_admin_id = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE 
            ad_id = ?;
    `;

    try {
        // Execute the update query using the extracted adminId
        const [result] = await db.promise().query(updateQuery, [adminId, adId]);

        if (result.affectedRows === 0) {
            // Check if the ad exists but is already Rejected
            const checkStatusQuery = "SELECT publish_status FROM ads WHERE ad_id = ?";
            const [statusResult] = await db.promise().query(checkStatusQuery, [adId]);
            
            if (statusResult.length > 0 && statusResult[0].publish_status === 'Rejected') {
                return res.status(200).json({
                    message: `Ad ${adId} is already Rejected. Updated admin ID and timestamp.`,
                    status: "Rejected",
                });
            }

            return res.status(404).json({
                message: "Ad not found or it's not a House property.",
            });
        }

        res.status(200).json({
            message: `Ad ${adId} rejected successfully.`,
            status: "Rejected",
        });
    } catch (error) {
        console.error("Database error rejecting ad:", error);
        res.status(500).json({ message: "Failed to update ad status in database." });
    }
};