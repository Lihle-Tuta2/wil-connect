const express = require("express");

const {
  getCompanyProfile,
  updateCompanyProfile,
  uploadCompanyLogo: saveCompanyLogo,
} = require("../controllers/companyController");

const verifyToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/roleMiddleware");
const uploadCompanyLogo = require("../middleware/companyLogoUpload");

const router = express.Router();

router.get(
  "/profile",
  verifyToken,
  verifyRole("Employer"),
  getCompanyProfile
);

router.put(
  "/profile",
  verifyToken,
  verifyRole("Employer"),
  updateCompanyProfile
);

router.post(
  "/profile/logo",
  verifyToken,
  verifyRole("Employer"),
  uploadCompanyLogo,
  saveCompanyLogo
);

module.exports = router;