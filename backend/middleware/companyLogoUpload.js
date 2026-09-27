const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const multer = require("multer");

const uploadDirectory = path.join(__dirname, "..", "uploads", "company-logos");
fs.mkdirSync(uploadDirectory, { recursive: true });

const extensionsByMimeType = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadDirectory),
    filename: (_req, file, callback) => {
      callback(null, `${crypto.randomUUID()}${extensionsByMimeType[file.mimetype]}`);
    },
  }),
  limits: { fileSize: 3 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!extensionsByMimeType[file.mimetype]) {
      callback(new Error("Choose a JPG, PNG, or WEBP image."));
      return;
    }
    callback(null, true);
  },
}).single("logo");

function uploadCompanyLogo(req, res, next) {
  upload(req, res, (error) => {
    if (error) {
      const message = error.code === "LIMIT_FILE_SIZE"
        ? "Company images must be 3 MB or smaller."
        : error.message;
      res.status(400).json({ message });
      return;
    }
    next();
  });
}

module.exports = uploadCompanyLogo;