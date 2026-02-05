const cloudinary = require("../config/cloudinaryConfig");
const crypto = require("crypto");
const streamifier = require("streamifier");

const uploadToCloudinary = ({
  file,
  folder,
  maxSizeMB = 5,
  allowed = ["jpg", "jpeg", "png", "webp"],
}) =>
  new Promise((resolve, reject) => {
    if (!file) return reject(new Error("No file provided"));

    if (file.size > maxSizeMB * 1024 * 1024) {
      return reject(new Error(`File too large. Max ${maxSizeMB}MB allowed.`));
    }

    const ext = file.originalname.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) {
      return reject(
        new Error(`Invalid file type. Allowed: ${allowed.join(", ")}`)
      );
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ quality: "auto" }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  return await cloudinary.uploader.destroy(publicId);
};

const generateSignedUploadUrl = (folder = "general") => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const params = `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;

  const signature = crypto
    .createHash("sha256")
    .update(params)
    .digest("hex");

  return {
    timestamp,
    signature,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder,
    uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
  };
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  generateSignedUploadUrl,
};
