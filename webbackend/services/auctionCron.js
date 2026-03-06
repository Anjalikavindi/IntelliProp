import cron from "node-cron";
import db from "../config/db.js";
import { sendAuctionEndEmails } from "../utils/auctionEmailer.js";

const startAuctionCron = () => {
  // Runs every minute
  cron.schedule("* * * * *", () => {
    console.log("Checking for expired auctions...");

    // Query to find Active auctions that have passed their end date
    const findExpiredQuery = `
      SELECT 
        auc.auction_id, auc.ad_id, auc.current_highest_bid,
        a.title,
        s.email AS seller_email, s.name AS seller_name,
        b.email AS bidder_email, b.name AS bidder_name
      FROM auction_details auc
      JOIN ads a ON auc.ad_id = a.ad_id
      JOIN users s ON a.user_id = s.id
      JOIN users b ON auc.highest_bidder_id = b.id
      WHERE auc.status = 'Active' 
      AND auc.auction_end <= NOW() 
      AND auc.highest_bidder_id IS NOT NULL
    `;

    db.query(findExpiredQuery, async (err, results) => {
      if (err) {
        console.error("Cron Database Error:", err);
        return;
      }

      if (results.length > 0) {
        for (const auction of results) {
          // 1. Mark as Closed so we don't process it again next minute
          db.query(
            "UPDATE auction_details SET status = 'Closed' WHERE auction_id = ?",
            [auction.auction_id],
            async (updateErr) => {
              if (updateErr) {
                console.error("Error updating auction status:", updateErr);
              } else {
                // 2. Send the emails
                await sendAuctionEndEmails({
                  title: auction.title,
                  seller_email: auction.seller_email,
                  seller_name: auction.seller_name,
                  bidder_email: auction.bidder_email,
                  bidder_name: auction.bidder_name,
                  highest_bid: auction.current_highest_bid,
                  ad_id: auction.ad_id
                });
              }
            }
          );
        }
      }
    });
  });
};

export default startAuctionCron;