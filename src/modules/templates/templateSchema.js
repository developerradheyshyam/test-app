const mongoose = require("mongoose");

const TemplateSchema = mongoose.model(
  "Template",
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = { TemplateSchema };
