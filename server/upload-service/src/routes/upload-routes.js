const express = require("express");
const multer = require("multer");
const { authenticatedRequest } = require("../middleware/auth-middleware");
const {
  uploadMedia,
  getAllMediaByUser,
} = require("../controllers/upload-controller");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage,
  limits: 10 * 1024 * 1024,
}).single("file");

router.post("/upload", authenticatedRequest, (req, res, next) => {
  upload(
    req,
    res,
    function (err) {
      if (err instanceof multer.MulterError) {
        res.status(400).json({
          success: false,
          message: err.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: err.message,
        });
      }
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "No file found",
        });
      }
      next();
    },
    uploadMedia
  );
});

router.get("/get", authenticatedRequest, getAllMediaByUser);

module.exports = router;
