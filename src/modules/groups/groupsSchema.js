const mongoose = require("mongoose");

const GroupSchema = mongoose.model(
  "Group",
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = GroupSchema;
