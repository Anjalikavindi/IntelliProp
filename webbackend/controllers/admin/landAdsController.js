import db from "../../config/db.js"; // Adjust based on your DB config path

export const getLandAdsList = async (req, res) => {
  // 1. Core query for Land details
  const coreQuery = `
        SELECT 
            a.ad_id AS adId,
            ld.land_id AS id,
            a.title,
            a.city,
            a.description,
            a.created_at AS createdAt,
            a.publish_status AS publishedStatus,
            u.name AS sellerName,
            u.email AS sellerEmail,
            u.mobile AS sellerMobile,
            ld.land_type AS landType,
            ld.land_size AS landSize,
            ld.price_per_perch,
            ld.allow_bidding AS allowBidding
        FROM ads a
        JOIN land_details ld ON a.ad_id = ld.ad_id
        JOIN users u ON a.user_id = u.id
        WHERE a.property_category = 'Land'
        ORDER BY a.created_at DESC;
    `;

  // 2. Query for all images associated with Land ads
  const imagesQuery = `
        SELECT ad_id, image_path, is_thumbnail
        FROM ad_images
        WHERE ad_id IN (SELECT ad_id FROM ads WHERE property_category = 'Land')
        ORDER BY is_thumbnail DESC;
    `;

  try {
    const [coreResults] = await db.promise().query(coreQuery);
    const [imageResults] = await db.promise().query(imagesQuery);

    // Map images to their respective ad IDs
    const adImagesMap = imageResults.reduce((acc, img) => {
      if (!acc[img.ad_id]) acc[img.ad_id] = [];
      acc[img.ad_id].push({
        path: img.image_path,
        isThumbnail: img.is_thumbnail,
      });
      return acc;
    }, {});

    // Combine data
    const landAds = coreResults.map((ad) => {
      const images = adImagesMap[ad.adId] || [];
      const thumbnailObj = images.find((img) => img.isThumbnail) || images[0];

      return {
        ...ad,
        sellerEmail: ad.sellerEmail, 
        sellerMobile: ad.sellerMobile,
        thumbnail: thumbnailObj ? thumbnailObj.path : null,
        images: images,
        // Format price for consistency
        formattedPrice: ad.price_per_perch
          ? `LKR ${parseFloat(ad.price_per_perch).toLocaleString()}`
          : "Negotiable",
        createdAt: new Date(ad.createdAt).toISOString().split("T")[0],
      };
    });

    res.status(200).json(landAds);
  } catch (error) {
    console.error("Error fetching land ads:", error);
    res.status(500).json({ message: "Error fetching land ads" });
  }
};

export const toggleLandBidding = async (req, res) => {
  const { adId } = req.params;
  const { allowBidding } = req.body;
  try {
    await db
      .promise()
      .query("UPDATE land_details SET allow_bidding = ? WHERE ad_id = ?", [
        allowBidding,
        adId,
      ]);
    res.status(200).json({ message: "Bidding status updated" });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};
