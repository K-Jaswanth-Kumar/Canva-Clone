const { uploadMediaToCloudinary } = require("../utils/cloudinary");
const Media = require("../models/media");

const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file found",
      });
    }
    const { originalName, mimetype, size, width, height } = req.file;
    const { userId } = req.user;

    const cloudinaryResult = await uploadMediaToCloudinary(req.file);
    const newlyCreatedMedia = new Media({
      userId,
      name: originalName,
      cloudinaryId: cloudinaryResult.public_id,
      url: cloudinaryResult.secure_url,
      mimeType: mimetype,
      size,
      width,
      height,
    });

    await newlyCreatedMedia.save();

    res.status(201).json({
      success: true,
      data: newlyCreatedMedia,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error while creating asset",
    });
  }
};

const getAllMediaByUser = async (req, res) => {
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
      message: "Error getting assets",
    });
  }
};

module.exports = { uploadMedia, getAllMediaByUser };
