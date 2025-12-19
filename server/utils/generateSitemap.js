// const fs = require("fs");
// const { SitemapStream, streamToPromise } = require("sitemap");
// const path = require("path");

// const generateSitemap = async (req, res) => {
//   try {
//     const sitemap = new SitemapStream({ hostname: "https://reldaindia.com" });

//     // List of static pages
//     const staticPages = [
//       { url: "/", changefreq: "daily", priority: 1.0 },
//       { url: "/product-category", changefreq: "daily", priority: 0.8 },
//       { url: "/ContactUsPage", changefreq: "monthly", priority: 0.6 },
//       // Add more static pages here
//     ];

//     // Add static pages to sitemap
//     staticPages.forEach(page => sitemap.write(page));

//     // Add dynamic product & category pages
//     const products = await fetchProductsFromDB();
//     products.forEach((product) =>
//       sitemap.write({ url: `/product/${product.slug}`, changefreq: "weekly", priority: 0.7 })
//     );

//     sitemap.end();
//     const sitemapXML = await streamToPromise(sitemap).then((data) => data.toString());

//     // Ensure the public directory exists
//     const publicDir = path.join(__dirname, "../../client/public");
//     if (!fs.existsSync(publicDir)) {
//       fs.mkdirSync(publicDir, { recursive: true });
//     }

//     // Save the sitemap.xml file
//     fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapXML, "utf8");

//     res.header("Content-Type", "application/xml");
//     res.send(sitemapXML);
//   } catch (error) {
//     console.error("Sitemap generation error:", error);
//     res.status(500).send("Failed to generate sitemap.");
//   }
// };

// const fetchProductsFromDB = async () => {
//   // Mock function to simulate fetching products from a database
//   return [{ slug: "product-1" }, { slug: "product-2" }];
// };

// module.exports = generateSitemap;

// const fs = require("fs");
// const { SitemapStream, streamToPromise } = require("sitemap");
// const path = require("path");
// const { fetchProductsFromDB } = require('../services/productService');

// const generateSitemap = async (req, res) => {
//   try {
//     const sitemap = new SitemapStream({ hostname: "https://www.reldaindia.com" });

//     // List of static pages
//     const staticPages = [
//       { url: "/", changefreq: "daily", priority: 1.0 },
//       { url: "/sign-up", changefreq: "daily", priority: 1.0 },
//       { url: "/blog-page", changefreq: "daily", priority: 1.0 },
//       { url: "/CareerPage", changefreq: "daily", priority: 1.0 },
//       { url: "/PrivacyPolicy", changefreq: "weekly", priority: 0.7 },
//       { url: "/TermsAndConditions", changefreq: "daily", priority: 0.7 },
//       { url: "/RefundPolicy", changefreq: "daily", priority: 0.7 },
//       { url: "/ShippingPolicy", changefreq: "daily", priority: 0.7 },
//       { url: "/PricingPolicy", changefreq: "daily", priority: 0.7 },



//       { url: "/product-category", changefreq: "daily", priority: 0.8 },
//       { url: "/ContactUsPage", changefreq: "monthly", priority: 0.6 },
//       // Add more static pages here
//       { url: "/AboutUs", changefreq: "monthly", priority: 0.6 },
//       { url: "/ProductRegistration", changefreq: "weekly", priority: 0.7 },
//       { url: "/AuthorizedDealer", changefreq: "weekly", priority: 0.7 },
//       { url: "/CustomerSupport", changefreq: "weekly", priority: 0.7 },

//     ];

//     // Add static pages to sitemap
//     staticPages.forEach(page => sitemap.write(page));

//     // Add dynamic product & category pages
//     const products = await fetchProductsFromDB();
//     products.forEach((product) =>
//       sitemap.write({ url: `/product/${product._id}`, changefreq: "weekly", priority: 0.7 })
//     );

//     sitemap.end();
//     const sitemapXML = await streamToPromise(sitemap).then((data) => data.toString());

//     // Ensure the public directory exists
//     const publicDir = path.join(__dirname, "../../client/public");
//     if (!fs.existsSync(publicDir)) {
//       fs.mkdirSync(publicDir, { recursive: true });
//     }

//     // Save the sitemap.xml file
//     fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapXML, "utf8");

//     res.header("Content-Type", "application/xml");
//     res.send(sitemapXML);
//   } catch (error) {
//     console.error("Sitemap generation error:", error);
//     res.status(500).send("Failed to generate sitemap.");
//   }
// };

// module.exports = generateSitemap;

const fs = require("fs");
const { SitemapStream, streamToPromise } = require("sitemap");
const path = require("path");
const { fetchProductsFromDB } = require("../services/productService");

const generateSitemap = async (req, res) => {
  try {
    const sitemap = new SitemapStream({ hostname: "https://www.reldaindia.com" });

    // Fetch registered routes dynamically
    const routes = [];
    if (req.app && req.app._router) {
      req.app._router.stack.forEach((middleware) => {
        if (middleware.route) {
          routes.push(middleware.route.path);
        }
      });
    }

    // Filter out API routes and keep only frontend pages
    const filteredRoutes = routes.filter(route => !route.startsWith("/api"));
    filteredRoutes.forEach(route => {
      sitemap.write({ url: route, changefreq: "weekly", priority: 0.7 });
    });

    // Add dynamic product pages
    const products = await fetchProductsFromDB();
    if (Array.isArray(products)) {
      products.forEach((product) => {
        sitemap.write({ url: `/product/${product._id}`, changefreq: "weekly", priority: 0.7 });
      });
    }

    sitemap.end();
    const sitemapXML = await streamToPromise(sitemap).then(data => data.toString());

    // Ensure public directory exists
    const publicDir = path.join(__dirname, "../../client/public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write sitemap file safely
    try {
      fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapXML, "utf8");
    } catch (err) {
      console.error("Error writing sitemap.xml:", err);
    }

    res.header("Content-Type", "application/xml");
    res.send(sitemapXML);
  } catch (error) {
    console.error("Sitemap generation error:", error.message || error);
    res.status(500).send("Failed to generate sitemap.");
  }
};

module.exports = generateSitemap;



// const fs = require('fs');
// const path = require('path');
// const { pathToFileURL } = require('url'); // Import pathToFileURL

// // List of routes to exclude
// const EXCLUDED_ROUTES = [
//     'cart',
//     'checkout',
//     'notfound',
//     'admin-panel',
//     'admin-panel/dashboard',
//     'admin-panel/all-users',
//     'admin-panel/all-products',
//     'admin-panel/all-categories',
//     'admin-panel/all-orders',
//     'admin-panel/orders',
//     'admin-panel/all-enquiries',
//     'admin-panel/all-complaints',
//     'admin-panel/all-contactus',
//     'admin-panel/all-product-registration',
//     'admin-panel/all-careers',
//     'admin-panel/all-returned-products',
//     'admin-panel/all-cart-items',
//     'admin-panel/all-cookies-page',
//     'admin-panel/add-parent-category',
// ];

// async function getStaticRoutes() {
//     try {
//         const { default: frontendRoutes } = await import(
//             pathToFileURL(path.join(__dirname, "../../client/src/index.js")).href
//         );

//         if (!frontendRoutes || !frontendRoutes.routes) {
//             throw new Error("Router configuration is missing.");
//         }

//         let staticRoutes = [];

//         frontendRoutes.routes.forEach(route => {
//             if (route.path && !EXCLUDED_ROUTES.includes(route.path.toLowerCase())) {
//                 staticRoutes.push(route.path);
//             }

//             if (route.children) {
//                 route.children.forEach(childRoute => {
//                     const fullPath = `${route.path}/${childRoute.path}`;
//                     if (!EXCLUDED_ROUTES.includes(fullPath.toLowerCase())) {
//                         staticRoutes.push(fullPath);
//                     }
//                 });
//             }
//         });

//         return staticRoutes;
//     } catch (error) {
//         console.error("❌ Error fetching static routes:", error.message);
//         return [];
//     }
// }


// // Sitemap generation function
// async function generateSitemap() {
//     try {
//         const staticRoutes = await getStaticRoutes();
//         const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
//         <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//             ${staticRoutes.map(route => `
//                 <url>
//                     <loc>https://www.reldaindia.com/${route}</loc>
//                     <changefreq>weekly</changefreq>
//                     <priority>0.8</priority>
//                 </url>
//             `).join('')}
//         </urlset>`;

//         fs.writeFileSync(path.join(__dirname, '../../client/public/sitemap.xml'), sitemapContent, 'utf8');
//         console.log('✅ Sitemap generated successfully!');
//     } catch (error) {
//         console.error('❌ Error generating sitemap:', error.message);
//     }
// }

// // Call the function
// generateSitemap();

// module.exports = generateSitemap;

