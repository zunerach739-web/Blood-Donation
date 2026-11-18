
const express = require("express");

const {
  registerDonor,
  getDonors,
  updateDonor,
  deleteDonor
} = require("../controllers/donorController");

const router = express.Router();

// REGISTER DONOR
router.post("/register", registerDonor);

// GET ALL DONORS
router.get("/", getDonors);

// UPDATE DONOR
router.put("/:id", updateDonor);

// DELETE DONOR
router.delete("/:id", deleteDonor);

module.exports = router;
