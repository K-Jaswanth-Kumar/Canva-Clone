const { uploadMediaToCloudinary } = require("../utils/cloudinary");
const Media = require("../models/media");

const uploadMedia = async (req, res) => {
  try {
    console.log("Upload request received:", {
      hasFile: !!req.file,
      userId: req.user?.userId,
      fileInfo: req.file
        ? {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
          }
        : null,
    });

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No File Found!",
      });
    }

    const { originalname, mimetype, size, width, height } = req.file;
    const { userId } = req.user;

    console.log("Uploading to Cloudinary...");
    const cloudinaryResult = await uploadMediaToCloudinary(req.file);
    console.log("Cloudinary upload successful:", cloudinaryResult.public_id);

    const newlyCreatedMedia = new Media({
      userId,
      name: originalname,
      cloudinaryId: cloudinaryResult.public_id,
      url: cloudinaryResult.secure_url,
      mimeType: mimetype,
      size,
      width,
      height,
    });

    await newlyCreatedMedia.save();
    console.log("Media saved to database");

    res.status(201).json({
      success: true,
      data: newlyCreatedMedia,
    });
  } catch (e) {
    console.error("Upload error details:", {
      message: e.message,
      stack: e.stack,
      name: e.name,
    });

    res.status(500).json({
      success: false,
      message: "Error creating asset",
      error: process.env.NODE_ENV === "development" ? e.message : undefined,
    });
  }
};
const getAllMediasByUser = async (req, res) => {
  try {
    const medias = await Media.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: medias,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch assets",
    });
  }
};

module.exports = { uploadMedia, getAllMediasByUser };
