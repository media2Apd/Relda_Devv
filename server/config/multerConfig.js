const multer = require('multer');
const path = require('path');
const fs = require('fs');




const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB file size limit
  },
}).array('returnImages', 5);

module.exports = upload;


