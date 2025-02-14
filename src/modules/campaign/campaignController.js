const mongoose = require("mongoose");
const { sendMailFromMailgun } = require("../../utils");
const { ContactSchema } = require("../contact/contactSchema");
const { TemplateSchema } = require("../templates/templateSchema");
const { CampaignSchema } = require("./campaignSchema");

const sendMail = async (req, res) => {
  try {
    const {
      campaignName,
      senderEmail,
      groupIds, // Updated to accept an array of group IDs
      subjectLine,
      templateId,
      batchSize = 1, // Default batch size
      delayBetweenBatches = 10000, // Delay in ms (10 seconds) between batches
    } = req.body;

    // Validate input fields
    if (
      !senderEmail ||
      !groupIds ||
      !Array.isArray(groupIds) ||
      !subjectLine ||
      !templateId
    ) {
      return res.status(400).json({ message: "Incomplete or invalid input" });
    }

    // Fetch the template
    const template = await TemplateSchema.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    let totalContactsProcessed = 0;
    let successCount = 0; // Counter for successful emails
    let failureCount = 0; // Counter for failed emails

    for (const groupId of groupIds) {
      // Extract actual group ID if passed as an object
      const actualGroupId =
        typeof groupId === "object" ? groupId.id || groupId._id : groupId;

      // Validate actualGroupId
      if (!mongoose.Types.ObjectId.isValid(actualGroupId)) {
        return res
          .status(400)
          .json({ message: `Invalid group ID: ${actualGroupId}` });
      }

      // Fetch contacts for the group
      const contacts = await ContactSchema.find({
        "group.id": new mongoose.Types.ObjectId(actualGroupId),
      });

      if (!contacts || contacts.length === 0) {
        return res
          .status(404)
          .json({
            message: `No contacts found for group ID: ${actualGroupId}`,
          });
      }

      const totalContacts = contacts.length;
      totalContactsProcessed += totalContacts;
      let batchIndex = 0;

      console.log(
        `Total contacts to send for group ID ${actualGroupId}: ${totalContacts}`
      );

      // Process emails in batches
      while (batchIndex < totalContacts) {
        const batch = contacts.slice(batchIndex, batchIndex + batchSize);
        const batchNumber = Math.ceil(batchIndex / batchSize) + 1;

        console.log(
          `Processing batch ${batchNumber} with ${batch.length} emails...`
        );

        await Promise.all(
          batch.map(async (contact) => {
            if (contact.email) {
              try {
                await sendMailFromMailgun({
                  from: senderEmail,
                  to: contact.email,
                  subject: subjectLine,
                  html: template.content,
                });
                console.log(`Email sent to: ${contact.email}`);
                successCount++; // Increment success counter
              } catch (error) {
                console.error(
                  `Failed to send email to: ${contact.email}. Error: ${error.message}`
                );
                failureCount++; // Increment failure counter
              }
            } else {
              console.warn(
                `Skipping contact with missing email: ${contact._id}`
              );
              failureCount++; // Increment failure counter for invalid contact
            }
          })
        );

        batchIndex += batchSize;

        // Delay between batches
        if (batchIndex < totalContacts) {
          console.log(
            `Waiting for ${delayBetweenBatches}ms before next batch...`
          );
          await new Promise((resolve) =>
            setTimeout(resolve, delayBetweenBatches)
          );
        }
      }
    }

    if (totalContactsProcessed === 0) {
      return res.status(404).json({
        message:
          "No valid contacts processed for any of the provided group IDs.",
      });
    }

    // Save campaign details in the database
    const campaign = new CampaignSchema({
      name: campaignName,
      groups: groupIds.map((id) => ({
        id: typeof id === "object" ? id.id || id._id : id,
      })), // Save all group IDs
      template: {
        id: templateId,
        name: template.name,
      },
      senderEmail,
      subjectLine,
    });

    await campaign.save();

    console.log(
      `Campaign details saved successfully. Total contacts processed: ${totalContactsProcessed}`
    );

    return res.status(201).json({
      message:
        "Emails sent in batches for all groups and campaign saved successfully",
      totalContactsProcessed,
      successCount, // Send number of successful emails
      failureCount, // Send number of failed emails
    });
  } catch (error) {
    console.error("Error during send-mail:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { sendMail };
