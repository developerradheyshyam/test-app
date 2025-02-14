const { Router } = require("express");
const { signUp } = require("./signUpController.js");
const { signIn } = require("./signInController.js");

const userRouter = Router();

// Routes
userRouter.post("/signup", signUp);
userRouter.post("/signin", signIn);

module.exports = userRouter;
