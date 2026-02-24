import db from "../../config/db.js";

export const getPublishedHouses = async (req, res) => {
  try {
    const query = `
      SELECT 
        a.ad_id,
        a.title,
        a.description,
        a.district,
        a.area,
        a.created_at,
        hd.house_id,
        hd.ad_type,
        hd.land_size,
        hd.area_sqft,
        hd.floors,
        hd.bedrooms,
        hd.bathrooms,
        hd.price,
        hd.negotiable,
        hd.year_built,
        hd.water_supply,
        hd.electricity_type,
        hd.parking_spots,
        hd.has_garden,
        hd.has_ac,
        img.image_path
      FROM ads a
      INNER JOIN house_details hd ON a.ad_id = hd.ad_id
      LEFT JOIN ad_images img 
        ON a.ad_id = img.ad_id AND img.is_thumbnail = 1
      WHERE a.property_category = 'House'
      AND a.publish_status = 'Published'
      ORDER BY a.created_at DESC
    `;

    const [rows] = await db.promise().query(query);

    // Format image URL
    const houses = rows.map((house) => ({
      ...house,
      image: house.image_path
        ? `http://localhost:5000/images/${house.image_path}`
        : null,
    }));

    res.status(200).json({
      success: true,
      count: houses.length,
      houses,
    });

  } catch (error) {
    console.error("Error fetching published houses:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching houses",
    });
  }
};

export const getHouseById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        a.ad_id,
        a.title,
        a.description,
        a.district,
        a.area,
        a.created_at,
        u.name AS owner_name,
        u.mobile,
        hd.house_id,
        hd.ad_type,
        hd.land_size,
        hd.area_sqft,
        hd.floors,
        hd.bedrooms,
        hd.bathrooms,
        hd.price,
        hd.negotiable,
        hd.year_built,
        hd.water_supply,
        hd.electricity_type,
        hd.parking_spots,
        hd.has_garden,
        hd.has_ac
      FROM ads a
      INNER JOIN house_details hd ON a.ad_id = hd.ad_id
      INNER JOIN users u ON a.user_id = u.id
      WHERE a.ad_id = ?
      AND a.property_category = 'House'
      AND a.publish_status = 'Published'
    `;

    const [rows] = await db.promise().query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "House not found" });
    }

    // Get all images
    const [images] = await db.promise().query(
      `SELECT image_path FROM ad_images WHERE ad_id = ?`,
      [id]
    );

    const house = {
      ...rows[0],
      images: images.map(
        (img) => `http://localhost:5000/images/${img.image_path}`
      ),
    };

    res.status(200).json(house);

  } catch (error) {
    console.error("Error fetching house by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};