
const Donor = require("../models/Donor");

// REGISTER DONOR
const registerDonor = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      bloodGroup,
      location,
      weight,
      disease,
      available
    } = req.body;

    if (
      !name ||
      !phone ||
      !bloodGroup ||
      !location ||
      weight === undefined ||
      weight === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields."
      });
    }

    if (!Number.isFinite(Number(weight)) || Number(weight) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid weight."
      });
    }

    const donor = await Donor.create({
      name,
      phone,
      email,
      bloodGroup,
      location,
      weight: Number(weight),
      disease,
      available
    });

    const publicDonor = await Donor.findById(donor._id);

    res.status(201).json({
      success: true,
      message: "Donor registered successfully!",
      donor: publicDonor
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET ALL DONORS
const getDonors = async (req, res) => {
  try {
    const { bloodGroup, location, available } = req.query;

    const filter = {};

    if (bloodGroup && bloodGroup !== "All") {
      filter.bloodGroup = bloodGroup;
    }

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i"
      };
    }

    if (available) {
      filter.available = available;
    }

    const donors = await Donor.find(filter)
      .sort({ createdAt: -1 })
      .select("-weight -disease -__v");

    res.status(200).json({
      success: true,
      count: donors.length,
      donors
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// UPDATE DONOR
const updateDonor = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "phone",
      "email",
      "bloodGroup",
      "location",
      "available"
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (
      !updates.name?.trim() ||
      !updates.phone?.trim() ||
      !updates.bloodGroup ||
      !updates.location?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields."
      });
    }

    const donor = await Donor.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      {
        new: true,
        runValidators: true
      }
    ).select("-weight -disease -__v");

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Donor updated successfully!",
      donor
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// DELETE DONOR
const deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Donor deleted successfully!"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// EXPORT FUNCTIONS
module.exports = {
  registerDonor,
  getDonors,
  updateDonor,
  deleteDonor
};
