import axios from "axios";
import db from "../../config/db.js";

export const getRecommendations = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Fetch all published houses (to find similarities among active ads)
    const [allHouses] = await db.promise().query(`
            SELECT a.ad_id, a.district, a.area, hd.land_size, hd.bedrooms, 
                   hd.bathrooms, hd.area_sqft, hd.parking_spots, hd.floors, 
                   hd.price, hd.year_built, hd.has_garden, hd.has_ac, 
                   hd.water_supply, hd.electricity_type
            FROM ads a
            INNER JOIN house_details hd ON a.ad_id = hd.ad_id
            WHERE a.publish_status = 'Published' AND a.property_category = 'House'
        `);

    // 2. Ask Flask for the IDs of the most similar houses
    const mlResponse = await axios.post("http://localhost:8000/recommend", {
      target_id: id,
      all_ads: allHouses,
    });

    const recIds = mlResponse.data.recommended_ad_ids;

    if (recIds.length === 0) return res.json([]);

    if (!recIds || recIds.length === 0) {
      return res.json([]);
    }

    // 3. Fetch full details (images, titles) for those specific IDs
    const [recommendedDetails] = await db.promise().query(
      `
            SELECT a.ad_id, a.title, hd.price, img.image_path
            FROM ads a
            INNER JOIN house_details hd ON a.ad_id = hd.ad_id
            LEFT JOIN ad_images img ON a.ad_id = img.ad_id AND img.is_thumbnail = 1
            WHERE a.ad_id IN (?)
            ORDER BY FIELD(a.ad_id, ?)
        `,
      [recIds, recIds],
    );

    // Format Image URLs
    const formattedRecs = recommendedDetails.map((ad) => ({
      ...ad,
      image: ad.image_path
        ? `http://localhost:5000/images/${ad.image_path}`
        : null,
    }));

    res.json(formattedRecs);
  } catch (error) {
    console.error("Rec Error:", error.message);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
};
