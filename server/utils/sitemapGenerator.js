const fs = require("fs");
const { SitemapStream, streamToPromise } = require("sitemap");
const path = require("path");
const { fetchProductsFromDB } = require('../services/productService');

const generateSitemap = async (req, res) => {
  try {
    const sitemap = new SitemapStream({ hostname: "https://www.reldaindia.com" });

    // List of static pages
    const staticPages = [
      { url: "/", changefreq: "daily", priority: 1.0 },
    //   { url: "/sign-up", changefreq: "daily", priority: 1.0 },
      { url: "/blog-page", changefreq: "daily", priority: 1.0 },
      { url: "/CareerPage", changefreq: "daily", priority: 1.0 },
      { url: "/PrivacyPolicy", changefreq: "weekly", priority: 0.7 },
      { url: "/TermsAndConditions", changefreq: "daily", priority: 0.7 },
      { url: "/RefundPolicy", changefreq: "daily", priority: 0.7 },
      { url: "/ShippingPolicy", changefreq: "daily", priority: 0.7 },
      { url: "/PricingPolicy", changefreq: "daily", priority: 0.7 },



      { url: "/product-category", changefreq: "daily", priority: 0.8 },
      { url: "/ContactUsPage", changefreq: "monthly", priority: 0.6 },
      // Add more static pages here
      { url: "/AboutUs", changefreq: "monthly", priority: 0.6 },
      { url: "/related-products", changefreq: "monthly", priority: 0.6 },
      { url: "/wishlist", changefreq: "monthly", priority: 0.6 },	
      { url: "/ProductRegistration", changefreq: "weekly", priority: 0.7 },
      { url: "/AuthorizedDealer", changefreq: "weekly", priority: 0.7 },
      { url: "/CustomerSupport", changefreq: "weekly", priority: 0.7 },

    ];

    // Add static pages to sitemap
    staticPages.forEach(page => sitemap.write(page));

    // Add dynamic product & category pages
    const products = await fetchProductsFromDB();
    products.forEach((product) =>
      sitemap.write({ url: `/product/${product._id}`, changefreq: "weekly", priority: 0.7 })
    );

    sitemap.end();
    const sitemapXML = await streamToPromise(sitemap).then((data) => data.toString());

    // Ensure the public directory exists
    const publicDir = path.join(__dirname, "../../client/public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Save the sitemap.xml file
    fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapXML, "utf8");

    res.header("Content-Type", "application/xml");
    res.send(sitemapXML);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Failed to generate sitemap.");
  }
};

module.exports = generateSitemap;