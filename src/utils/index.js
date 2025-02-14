const nodemailer = require("nodemailer");
const mailgunTransport = require("nodemailer-mailgun-transport");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

const mailgunOptions = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY, // Mailgun API key from .env
    domain: process.env.MAILGUN_DOMAIN, // Mailgun domain from .env
  },
};

const mailgunTransporter = nodemailer.createTransport(
  mailgunTransport(mailgunOptions)
);

const sendMailFromMailgun = async (emailOptions) => {
  // Validate email options
  if (
    !emailOptions ||
    !emailOptions.to ||
    !emailOptions.from ||
    !emailOptions.subject ||
    !emailOptions.html
  ) {
    throw new Error(
      "Invalid email options provided. Ensure 'to', 'from', 'subject', and 'html' are included."
    );
  }

  const Options = {
    ...emailOptions,
    replyTo: emailOptions.replyTo || emailOptions.from,
  };

  try {
    const mail = await mailgunTransporter.sendMail(Options);
    console.log("Email sent successfully:", mail.messageId);
    return mail;
  } catch (error) {
    console.error("Error sending email:", error.message, error.stack);
    throw error; // Rethrow the error for the controller to handle
  }
};

module.exports = { sendMailFromMailgun };
