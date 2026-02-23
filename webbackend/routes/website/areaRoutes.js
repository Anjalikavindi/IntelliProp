import express from "express";
import db from "../../config/db.js";

const router = express.Router();

// GET areas by district_id
router.get("/:districtId", (req, res) => {
  const { districtId } = req.params;

  const query = `
    SELECT area_id, area_name 
    FROM areas 
    WHERE district_id = ?
    ORDER BY area_name ASC
  `;

  db.execute(query, [districtId], (err, results) => {
    if (err) {
      console.error("Area Fetch Error:", err);
      return res.status(500).json({
        success: false,
        message: "Error fetching areas",
      });
    }

    return res.status(200).json({
      success: true,
      areas: results,
    });
  });
});

export default router;