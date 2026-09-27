const express = require("express");

const {
  getAllUsers,
  getAllCompanies,
  approveCompany,
  rejectCompany,
  getAllOpportunitiesAdmin
} = require("../controllers/adminController");

const verifyToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/users",
  verifyToken,
  verifyRole("Admin"),
  getAllUsers
);

router.get(
  "/companies",
  verifyToken,
  verifyRole("Admin"),
  getAllCompanies
);

router.put(
  "/companies/:id/approve",
  verifyToken,
  verifyRole("Admin"),
  approveCompany
);

router.put(
  "/companies/:id/reject",
  verifyToken,
  verifyRole("Admin"),
  rejectCompany
);

router.get(
  "/opportunities",
  verifyToken,
  verifyRole("Admin"),
  getAllOpportunitiesAdmin
);

module.exports = router;