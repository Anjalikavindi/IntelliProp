import db from "../../config/db.js";

/**
 * @desc Fetch all House (Residency) ads with details for admin view.
 * @route GET /api/admin/ads/residencies
 * @access Private (Admin only)
 */
export const getHouseAdsList = async (req, res) => {
  const query = `
    SELECT 
        a.ad_id AS id,
        a.title,
        a.city,
        a.created_at AS createdAt,
        a.publish_status AS publishedStatus,
        u.name AS sellerName,
        hd.land_size AS landSize,
        hd.area_sqft AS area,
        hd.floors,
        hd.bedrooms,
        hd.bathrooms,
        hd.price,
        ai.image_path AS thumbnail
    FROM 
        ads a
    JOIN 
        house_details hd ON a.ad_id = hd.ad_id
    JOIN 
        users u ON a.user_id = u.id
    LEFT JOIN 
        ad_images ai ON a.ad_id = ai.ad_id AND ai.is_thumbnail = 1
    WHERE 
        a.property_category = 'House'
    ORDER BY 
        a.created_at DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error fetching house ads:", err);
      return res.status(500).json({ message: "Error fetching residency advertisements from database." });
    }

    // Map results to match the frontend structure (and format price/size)
    const houseAds = results.map(ad => {
        
        // --- FIX: Convert MySQL DECIMAL/String values to float numbers ---
        const parsedLandSize = ad.landSize !== null ? parseFloat(ad.landSize) : null;
        const parsedArea = ad.area !== null ? parseFloat(ad.area) : null;
        const parsedPrice = ad.price !== null ? parseFloat(ad.price) : null;
        const thumbnailPath = ad.thumbnail 
            ? `http://localhost:5000/images/${ad.thumbnail}` 
            : '/default-house.png';
        
        return {
            id: ad.id,
            thumbnail: thumbnailPath,
            title: ad.title,
            city: ad.city,
            sellerName: ad.sellerName,
            
            // Apply toFixed() on the parsed float number
            landSize: `${parsedLandSize !== null ? parsedLandSize.toFixed(2) : 'N/A'} Perches`,
            
            // Area formatting (no toFixed() needed if area_sqft is meant to be an integer, but safe to use parsedArea)
            area: `${parsedArea !== null ? parsedArea : 'N/A'} sqft`, 
            
            floors: ad.floors,
            bedrooms: ad.bedrooms,
            bathrooms: ad.bathrooms,
            
            // Apply toLocaleString() on the parsed float number
            price: parsedPrice !== null ? `LKR ${parsedPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'Negotiable',
            
            createdAt: new Date(ad.createdAt).toISOString().split('T')[0], // YYYY-MM-DD
            publishedStatus: ad.publishedStatus,
        };
    });

    return res.json(houseAds);
  });
};