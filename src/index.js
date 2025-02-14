const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const contactRouter = require("./modules/contact/contactRoutes.js");
const userRouter = require("./modules/user/userRoutes.js");
const templateRouter = require("./modules/templates/templateRoutes.js"); // const template routes
const campaignRouter = require("./modules/campaign/campaignRoutes.js");
const groupRouter = require("./modules/groups/groupsRoutes.js");

dotenv.config(); // Load environment variables

const app = express();
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Middleware to parse JSON requests

// Define the port
const port = process.env.PORT || 8000;

// MongoDB connection function
const connectToDatabase = async () => {
  try {
    console.log('process.env.MONGO_URI ', process.env.MONGO_URI )
    const MONGO_URI =
      process.env.MONGO_URI ;
     await  mongoose.connect(MONGO_URI, {
        dbName: "GaganDb", // Specify database name here
        useNewUrlParser: true,
        useUnifiedTopology: true
      })// Connect to MongoDB
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the process if MongoDB connection fails
  }
};

// Connect to MongoDB
connectToDatabase();

// Routes
app.use("/contact", contactRouter); // Contact API routes
app.use("/api/user", userRouter); // User API routes (e.g., signup, signin)
app.use("/templates", templateRouter); // Templates API routes
app.use("/campaign", campaignRouter);
app.use("/groups", groupRouter); // Groups API routes

// Default route for invalid endpoints
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
