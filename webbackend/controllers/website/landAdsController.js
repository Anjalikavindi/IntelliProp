import db from "../../config/db.js";

// Get all published land ads
export const getPublishedLands = async (req, res) => {
  const query = `
    SELECT 
      a.ad_id AS id,
      a.title,
      a.city,
      a.updated_at AS published,
      ld.land_size AS size,
      ld.price_per_perch AS price,
      u.is_email_verified AS verified,
      (SELECT image_path FROM ad_images WHERE ad_id = a.ad_id AND is_thumbnail = 1 LIMIT 1) AS image
    FROM ads a
    JOIN land_details ld ON a.ad_id = ld.ad_id
    JOIN users u ON a.user_id = u.id
    WHERE a.property_category = 'Land' AND a.publish_status = 'Published'
    ORDER BY a.updated_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching lands:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json(results);
  });
};

// Get specific land details by ID
export const getLandDetailById = async (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      a.ad_id, a.title, a.description, a.city, a.property_category, a.updated_at,
      ld.land_type, ld.land_size, ld.price_per_perch, ld.allow_bidding,
      u.name AS seller_name, u.mobile AS seller_mobile, u.is_email_verified,
      auc.auction_end, auc.current_highest_bid, auc.status AS auction_status
    FROM ads a
    JOIN land_details ld ON a.ad_id = ld.ad_id
    JOIN users u ON a.user_id = u.id
    LEFT JOIN auction_details auc ON a.ad_id = auc.ad_id
    WHERE a.ad_id = ? AND a.property_category = 'Land'
  `;

  const imagesQuery = `SELECT image_path, is_thumbnail FROM ad_images WHERE ad_id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0)
      return res.status(404).json({ message: "Ad not found" });

    const landData = results[0];

    // Auto-close logic: If end time passed but status is still 'Active'
    if (
      landData.auction_end &&
      new Date(landData.auction_end) < new Date() &&
      landData.auction_status === "Active"
    ) {
      db.query("UPDATE auction_details SET status = 'Closed' WHERE ad_id = ?", [
        id,
      ]);
      landData.auction_status = "Closed";
    }

    db.query(imagesQuery, [id], (err, imageResults) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Database error fetching images" });

      res.status(200).json({ ...landData, images: imageResults });
    });
  });
};

export const placeBid = async (req, res) => {
  const { ad_id, bid_amount } = req.body;
  const bidder_id = req.userId;

  // 1. Get current auction status and prices
  const auctionQuery = `
    SELECT auction_id, starting_price, current_highest_bid, auction_end, status 
    FROM auction_details WHERE ad_id = ?
  `;

  db.query(auctionQuery, [ad_id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0)
      return res.status(404).json({ message: "Auction not found" });

    const auction = results[0];
    const currentTime = new Date();
    const auctionEnd = new Date(auction.auction_end);

    if (!bidder_id) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    // 2. Validate Auction Status and Time
    if (auction.status !== "Active" || currentTime > auctionEnd) {
      return res.status(400).json({ message: "This auction is closed." });
    }

    // 3. Validate Bid Amount
    const minRequired = auction.current_highest_bid || auction.starting_price;
    if (Number(bid_amount) <= Number(minRequired)) {
      return res.status(400).json({
        message: `Bid must be higher than LKR ${Number(
          minRequired
        ).toLocaleString()}`,
      });
    }

    // 4. Perform Transaction (Insert Bid & Update Highest Bid)
    db.beginTransaction((err) => {
      if (err) return res.status(500).json({ message: "Transaction error" });

      const insertBid =
        "INSERT INTO auction_bids (auction_id, bidder_id, bid_amount) VALUES (?, ?, ?)";
      db.query(
        insertBid,
        [auction.auction_id, bidder_id, bid_amount],
        (err) => {
          if (err) {
            return db.rollback(() =>
              res.status(500).json({ message: "Error saving bid" })
            );
          }

          const updateAuction =
            "UPDATE auction_details SET current_highest_bid = ?, highest_bidder_id = ? WHERE auction_id = ?";
          db.query(
            updateAuction,
            [bid_amount, bidder_id, auction.auction_id],
            (err) => {
              if (err) {
                return db.rollback(() =>
                  res.status(500).json({ message: "Error updating auction" })
                );
              }

              db.commit((err) => {
                if (err) {
                  return db.rollback(() =>
                    res.status(500).json({ message: "Commit error" })
                  );
                }
                res.status(200).json({ message: "Bid placed successfully!" });
              });
            }
          );
        }
      );
    });
  });
};
