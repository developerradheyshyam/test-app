const { Router } = require("express");
const { sendMail } = require("./campaignController.js");

const campaignRouter = Router();

campaignRouter.post("/send-mail", sendMail); // Route to send mail

module.exports = campaignRouter;
