const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const uploadMediaToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    // Check if Cloudinary is configured
    if (
      !process.env.cloud_name ||
      !process.env.api_key ||
      !process.env.api_secret
    ) {
      return reject(new Error("Cloudinary configuration missing"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};
module.exports = { uploadMediaToCloudinary };
