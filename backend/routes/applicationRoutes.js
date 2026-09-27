const express = require("express");

const {
  applyForOpportunity,
  getMyApplications,
  getOpportunityApplicants,
  updateApplicationStatus,
  withdrawApplication
} = require("../controllers/applicationController");

const verifyToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/roleMiddleware");

const router = express.Router();

// Student routes
router.post(
  "/opportunity/:id",
  verifyToken,
  verifyRole("Student"),
  applyForOpportunity
);

router.get(
  "/my",
  verifyToken,
  verifyRole("Student"),
  getMyApplications
);

router.put(
  "/:id/withdraw",
  verifyToken,
  verifyRole("Student"),
  withdrawApplication
);

// Employer routes
router.get(
  "/opportunity/:id/applicants",
  verifyToken,
  verifyRole("Employer"),
  getOpportunityApplicants
);

router.put(
  "/:id/status",
  verifyToken,
  verifyRole("Employer"),
  updateApplicationStatus
);

module.exports = router;