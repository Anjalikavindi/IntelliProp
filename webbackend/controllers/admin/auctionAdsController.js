import db from "../../config/db.js";

export const getAuctionAdsList = async (req, res) => {
    const query = `
        SELECT 
            auc.auction_id AS id,
            a.title AS adTitle,
            a.city,
            auc.starting_price AS startingPrice,
            auc.current_highest_bid AS currentHighestBid,
            auc.auction_end AS auctionEndTime,
            auc.status,
            -- Seller Details
            u_seller.name AS sellerName,
            u_seller.email AS sellerEmail,
            u_seller.mobile AS sellerMobile,
            -- Highest Bidder Details
            u_bidder.name AS highestBidder,
            u_bidder.email AS highestBidderEmail,
            u_bidder.mobile AS bidderMobile
        FROM 
            auction_details auc
        JOIN 
            ads a ON auc.ad_id = a.ad_id
        JOIN 
            users u_seller ON a.user_id = u_seller.id
        LEFT JOIN 
            users u_bidder ON auc.highest_bidder_id = u_bidder.id
        ORDER BY 
            auc.auction_end DESC;
    `;

    try {
        const [results] = await db.promise().query(query);

        const formattedResults = results.map(row => ({
            id: row.id,
            adTitle: row.adTitle,
            city: row.city,
            startingPrice: row.startingPrice ? `LKR ${parseFloat(row.startingPrice).toLocaleString()}` : "0.00",
            currentHighestBid: row.currentHighestBid ? `LKR ${parseFloat(row.currentHighestBid).toLocaleString()}` : "N/A",
            status: row.status,
            sellerName: row.sellerName,
            sellerEmail: row.sellerEmail,
            sellerMobile: row.sellerMobile,
            highestBidder: row.highestBidder || "No Bids Yet",
            highestBidderEmail: row.highestBidderEmail || "N/A",
            bidderMobile: row.bidderMobile || null,
            auctionEndTime: new Date(row.auctionEndTime).toLocaleString('en-GB', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }));

        res.status(200).json(formattedResults);
    } catch (error) {
        console.error("Database error fetching auctions:", error);
        res.status(500).json({ message: "Error fetching auction details." });
    }
};