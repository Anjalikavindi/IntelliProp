import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendAuctionEndEmails = async (auctionData) => {
  const { title, seller_email, seller_name, bidder_email, bidder_name, highest_bid, ad_id } = auctionData;

  const commonStyles = `style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;"`;

  const senderName = "IntelliProp"; 
  const senderEmail = process.env.EMAIL_USER;

  // 1. Email to Seller
  const sellerMailOptions = {
    from: `"${senderName}" <${senderEmail}>`,
    to: seller_email,
    subject: `Auction Ended: ${title}`,
    html: `
      <div ${commonStyles}>
        <h2>Congratulations ${seller_name}!</h2>
        <p>The auction for your land <strong>"${title}"</strong> has ended.</p>
        <p><strong>Winning Bid:</strong> LKR ${Number(highest_bid).toLocaleString()}</p>
        <p><strong>Winner:</strong> ${bidder_name} (${bidder_email})</p>
        <p>Please contact the bidder to proceed with the transaction.</p>
        <br/>
        <p>Best regards,<br/>IntelliProp Team</p>
      </div>
    `,
  };

  // 2. Email to Highest Bidder
  const bidderMailOptions = {
    from: `"${senderName}" <${senderEmail}>`,
    to: bidder_email,
    subject: `You Won the Auction: ${title}!`,
    html: `
      <div ${commonStyles}>
        <h2>Congratulations ${bidder_name}!</h2>
        <p>You have successfully won the auction for <strong>"${title}"</strong>.</p>
        <p><strong>Your Winning Bid:</strong> LKR ${Number(highest_bid).toLocaleString()}</p>
        <p><strong>Seller:</strong> ${seller_name} (${seller_email})</p>
        <p>The seller will contact you shortly, or you can reach out to them via the platform.</p>
        <br/>
        <p>Best regards,<br/>IntelliProp Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(sellerMailOptions);
    await transporter.sendMail(bidderMailOptions);
    console.log(`Auction emails sent for Ad ID: ${ad_id}`);
  } catch (error) {
    console.error("Error sending auction emails:", error);
  }
};