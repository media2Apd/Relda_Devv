const multer = require("multer");

const storage = multer.diskStorage({});
const bannerUpload = multer({ storage });

module.exports = bannerUpload;
