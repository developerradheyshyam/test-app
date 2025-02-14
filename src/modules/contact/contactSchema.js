const mongoose = require("mongoose");

const ContactSchema = mongoose.model(
  "Contact",
  new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true }, // Email is required and unique
    mobile: { type: String, sparse: true }, // Unique only for non-empty values
    group: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    creationDate: { type: Date, default: Date.now },
  })
);

module.exports = { ContactSchema };
