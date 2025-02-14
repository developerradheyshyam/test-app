const express = require("express");
const {
  createTemplate,
  getAllTemplates,
  deleteTemplate,
} = require("./templateController.js");

const router = express.Router();

// Define routes
router.post("/", createTemplate); // Create a new template
router.get("/", getAllTemplates); // Get all templates
router.delete("/:id", deleteTemplate); // Delete a template by ID

module.exports = router;
