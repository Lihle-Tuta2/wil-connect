const express = require("express");

const {
  getStudentProfile,
  updateStudentProfile
} = require("../controllers/studentController");

const verifyToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/profile",
  verifyToken,
  verifyRole("Student"),
  getStudentProfile
);

router.put(
  "/profile",
  verifyToken,
  verifyRole("Student"),
  updateStudentProfile
);

module.exports = router;