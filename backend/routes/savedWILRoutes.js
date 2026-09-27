const express = require("express");

const {
  saveWIL,
  getSavedWILs,
  removeSavedWIL
} = require("../controllers/savedWILController");

const verifyToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/:id",
  verifyToken,
  verifyRole("Student"),
  saveWIL
);

router.get(
  "/",
  verifyToken,
  verifyRole("Student"),
  getSavedWILs
);

router.delete(
  "/:id",
  verifyToken,
  verifyRole("Student"),
  removeSavedWIL
);

module.exports = router;