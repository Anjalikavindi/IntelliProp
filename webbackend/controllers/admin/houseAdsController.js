import db from "../../config/db.js";

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
