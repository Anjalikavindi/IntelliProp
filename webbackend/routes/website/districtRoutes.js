import express from "express";
import db from "../../config/db.js";

const router = express.Router();

// GET all districts
router.get("/", (req, res) => {
  const query = "SELECT * FROM districts ORDER BY district_name ASC";

  db.execute(query, [], (err, results) => {
    if (err) {
      console.error("District Fetch Error:", err);
      return res.status(500).json({
        success: false,
        message: "Error fetching districts",
      });
    }

    return res.status(200).json({
      success: true,
      districts: results,
    });
  });
});

export default router;