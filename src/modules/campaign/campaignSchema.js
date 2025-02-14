const mongoose = require("mongoose");

const CampaignSchema = mongoose.model(
  "Campaign",
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      group: [
        {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true,
          },
        },
      ],
      template: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Template",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
      senderEmail: {
        type: String,
        required: true,
      },
      subjectLine: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = { CampaignSchema };
