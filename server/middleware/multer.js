const multer = require("multer");

const memoryStorage = multer.memoryStorage();

const uploadBlogMedia = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).fields([
  { name: "heroImage", maxCount: 1 },
  { name: "blockImages", maxCount: 20 },
]);

module.exports = uploadBlogMedia;
