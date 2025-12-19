const cron = require("node-cron");
const axios = require("axios");
const transporter = require("../../config/nodemailerConfig"); // Ensure this is correctly configured

// Schedule: Every day at 6:00 AM
 cron.schedule("10 6 * * *", async () => {
   //cron.schedule("35 17 * * *", async () => {
  try {
    console.log("Fetching dashboard data for daily email...");

    // Fetch data from the dashboard API
    const response = await axios.get("https://www.reldaindia.com/api/dashboard");
    const dashboardData = response.data.data;

    // Generate the email content
    const cards = [];

    // Set fixed card dimensions
    const cardWidth = "230px";
    const cardHeight = "150px"; // You can adjust this height as needed
    
    const wrapCard = (html) => `
      <div style="margin:6px;">
        ${html}
      </div>
    `;
    
    const cardStyle = `
      width:${cardWidth};
      height:${cardHeight};
      box-sizing:border-box;
      padding:15px;
      border-radius:10px;
      overflow:hidden;
    `;
    
    // Visitors
    cards.push(wrapCard(`
      <div style="${cardStyle}background:#dce9f9;">
        <p><strong>👥 Visitors</strong></p>
        <p>${dashboardData.visitors.total}</p>
        <p style="font-size:12px;color:#555;">${dashboardData.visitors.statics}</p>
      </div>
    `));
    cards.push(wrapCard(`
      <div style="${cardStyle}background:#dce9f9;">
        <p><strong>📅 Visitors MTD</strong></p>
        <p>${dashboardData.visitors.monthly.total}</p>
        <p style="font-size:12px;color:#555;">${dashboardData.visitors.monthly.statics}</p>
      </div>
    `));
    cards.push(wrapCard(`
      <div style="${cardStyle}background:#dce9f9;">
        <p><strong>📆 Visitors YTD</strong></p>
        <p>${dashboardData.visitors.yearly.total}</p>
        <p style="font-size:12px;color:#555;">${dashboardData.visitors.yearly.statics}</p>
      </div>
    `));
    
    // Users
    cards.push(wrapCard(`
      <div style="${cardStyle}background:#fbd4eb;">
        <p><strong>🙋 Users</strong></p>
        <p>${dashboardData.users.total}</p>
        <p style="font-size:12px;color:#555;">Total User Count</p>
      </div>
    `));
    cards.push(wrapCard(`
      <div style="${cardStyle}background:#fbd4eb;">
        <p><strong>📅 Users MTD</strong></p>
        <p>${dashboardData.users.monthly}</p>
      </div>
    `));
    cards.push(wrapCard(`
      <div style="${cardStyle}background:#fbd4eb;">
        <p><strong>📆 Users YTD</strong></p>
        <p>${dashboardData.users.yearly}</p>
      </div>
    `));
    
    // Orders
    cards.push(wrapCard(`
      <div style="${cardStyle}background:#ffe4c4;">
        <p><strong>📦 Orders</strong></p>
        <p>${dashboardData.orders.total}</p>
      </div>
    `));
    cards.push(wrapCard(`
      <div style="${cardStyle}background:#ffe4c4;">
        <p><strong>📅 Orders MTD</strong></p>
        <p>${dashboardData.orders.monthly}</p>
      </div>
    `));
    cards.push(wrapCard(`
      <div style="${cardStyle}background:#ffe4c4;">
        <p><strong>📆 Orders YTD</strong></p>
        <p>${dashboardData.orders.yearly}</p>
      </div>
    `));
    
    // Sales
    cards.push(wrapCard(`
      <div style="${cardStyle}background:#d5f9d4;">
        <p><strong>💰 Sales</strong></p>
        <p>₹${dashboardData.sales.total.toFixed(2)}</p>
        <p style="font-size:12px;color:#555;">${dashboardData.sales.statics}</p>
      </div>
    `));
    cards.push(wrapCard(`
      <div style="${cardStyle}background:#d5f9d4;">
        <p><strong>📅 Sales MTD</strong></p>
        <p>₹${dashboardData.sales.monthly.total.toFixed(2)}</p>
        <p style="font-size:12px;color:#555;">${dashboardData.sales.monthly.statics}</p>
      </div>
    `));
    cards.push(wrapCard(`
      <div style="${cardStyle}background:#d5f9d4;">
        <p><strong>📆 Sales YTD</strong></p>
        <p>₹${dashboardData.sales.yearly.total.toFixed(2)}</p>
        <p style="font-size:12px;color:#555;">${dashboardData.sales.yearly.statics}</p>
      </div>
    `));
    
    // Sales Return
    cards.push(wrapCard(`
      <div style="${cardStyle}background:#fad4d4;">
        <p><strong>↩️ Sales Return</strong></p>
        <p>₹${dashboardData.salesReturn.return}</p>
      </div>
    `));
    cards.push(wrapCard(`
      <div style="${cardStyle}background:#fad4d4;">
        <p><strong>❌ Cancelled Sales</strong></p>
        <p>₹${dashboardData.salesReturn.cancel}</p>
      </div>
    `));
    
    // Products, Stock, Categories
    cards.push(wrapCard(`
      <div style="${cardStyle}background:#e2d4f9;">
        <p><strong>📦 Total Products</strong></p>
        <p>${dashboardData.totalProducts}</p>
      </div>
    `));
    cards.push(wrapCard(`
      <div style="${cardStyle}background:#e2d4f9;">
        <p><strong>📊 Product Stock</strong></p>
        <p>${dashboardData.productStock}</p>
      </div>
    `));
    cards.push(wrapCard(`
      <div style="${cardStyle}background:#e2d4f9;">
        <p><strong>📁 Total Categories</strong></p>
        <p>${dashboardData.categoryCount}</p>
      </div>
    `));
    
    // Cart
    cards.push(wrapCard(`
      <div style="${cardStyle}background:#f9f3d4;">
        <p><strong>🛒 Cart Count</strong></p>
        <p>${dashboardData.cartCount}</p>
      </div>
    `));
    
    // Status counts
    Object.entries(dashboardData.statuses.total).forEach(([key, value]) => {
      cards.push(wrapCard(`
        <div style="${cardStyle}background:#fffbe6;">
          <p><strong>${key.charAt(0).toUpperCase() + key.slice(1)} Count</strong></p>
          <p>${value}</p>
        </div>
      `));
    });
    
    // Group every 3 cards into a row
    const groupedCards = [];
    for (let i = 0; i < cards.length; i += 3) {
      groupedCards.push(`
        <div style="display:flex;justify-content:center;flex-wrap:wrap;">
          ${cards.slice(i, i + 3).join("")}
        </div>
      `);
    }
    
    // Final HTML
    const html = `
      <div style="max-width:750px;margin:0 auto;padding:20px;font-family:sans-serif;background:#f5f5f5;">
       <img src="https://res.cloudinary.com/dbbebewu2/image/upload/v1746787276/Relda_logo_1_k0ilvf.png" alt="RELDA India Logo" style="height:40px;margin-bottom:10px;" /><br>
        <h2 style="text-align:center;margin-bottom:30px;">📊 Daily Dashboard Summary</h2>
        ${groupedCards.join("")}
        <p style="text-align:center;margin-top:40px;font-size:12px;color:#666;">
  Regards,<br><strong>Automated Mail from Relda India</strong><br><br>
  &copy; 2024 RELDA India - All Rights Reserved.<br>
  Marketed by LaMart Group<br>
  Registered Office: Plot No 17A, Majestic Avenue, Krishna Nagar, Madhavaram Milk Colony, Chennai, Tamilnadu 600051.<br>
  <em>RELDA India logo and its design are trademarks owned by LaMART Group.</em>
</p>

      </div>
    `;
    
  

    // Send the email
    const now = new Date();
    const formattedDate = now.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
    
    await transporter.sendMail({
      from: "admin@reldaindia.com",
      to: [
        //"mediaexecutive2.apd@gmail.com",
         "ceo@apdgroup.org",
        // "sivaganesh.m@digida.in",
        // "mediaexecutive4.apd@gmail.com",
        // "designerexecutive2.apd@gmail.com",
      ],
        
      cc: "mediaexecutive2.apd@gmail.com",
        
      subject: `Daily Business Report - ${formattedDate}`,
      html,
    });
    

    console.log("Daily dashboard email sent successfully.");
  } catch (error) {
    console.error("Failed to send daily dashboard email:", error.message);
  }
},
 {
  timezone: "Asia/Kolkata"
});