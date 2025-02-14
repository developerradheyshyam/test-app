const { Router } = require("express");
const {
  addContact,
  getContacts,
  editContact,
  deleteContact,
  getGroups,
  getContactsByGroup,
} = require("./contactController.js");

const contactRouter = Router();

contactRouter.post("/add", addContact); // Add a contact
contactRouter.get("/all", getContacts); // Get all contacts
contactRouter.put("/edit/:id", editContact); // Edit a contact by ID
contactRouter.delete("/delete/:id", deleteContact); // Delete a contact by ID
contactRouter.get("/groups", getGroups); // Get unique groups
contactRouter.get("/contacts-by-group/:groupId", getContactsByGroup); // Get unique groups

module.exports = contactRouter;
