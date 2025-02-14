const { TemplateSchema } = require("./templateSchema.js");

// Create a new template
const createTemplate = async (req, res) => {
  try {
    const { name, content } = req.body;
    if (!name || !content) {
      return res.status(400).json({ message: "Name and content are required" });
    }

    const newTemplate = await TemplateSchema.create({ name, content });
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all templates
const getAllTemplates = async (req, res) => {
  try {
    if (TemplateSchema == null) {
      console.log("Yes");
    }
    const templates = await TemplateSchema.find();
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a template
const deleteTemplate = async (req, res) => {
  try {
    const template = await TemplateSchema.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.status(200).json({ message: "Template deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTemplate, getAllTemplates, deleteTemplate };
