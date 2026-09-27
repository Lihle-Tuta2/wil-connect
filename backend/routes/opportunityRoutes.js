const express = require("express");

const {
  createOpportunity,
  getMyOpportunities,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity
} = require("../controllers/opportunityController");

const verifyToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/roleMiddleware");

const router = express.Router();

// Employer routes
router.post(
  "/",
  verifyToken,
  verifyRole("Employer"),
  createOpportunity
);

router.get(
  "/my",
  verifyToken,
  verifyRole("Employer"),
  getMyOpportunities
);

router.put(
  "/:id",
  verifyToken,
  verifyRole("Employer"),
  updateOpportunity
);

router.delete(
  "/:id",
  verifyToken,
  verifyRole("Employer"),
  deleteOpportunity
);

router.get(
  "/",
  getAllOpportunities
);

router.get("/:id", getOpportunityById);

module.exports = router;