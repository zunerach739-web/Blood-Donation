
const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ""
    },

    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    weight: {
      type: Number,
      required: true,
      min: 1,
      select: false
    },

    disease: {
      type: String,
      default: "",
      select: false
    },

    available: {
      type: String,
      enum: ["Yes", "No"],
      default: "Yes"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Donor", donorSchema);
