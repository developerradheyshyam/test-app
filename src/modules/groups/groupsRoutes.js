const Router = require("express").Router;
const {
  creategroup,
  getAllGroups,
  deleteGroup,
  EditGroup,
} = require("./groupsController.js");

const groupsRouter = Router();

groupsRouter.post("/", creategroup); // Create a new group
groupsRouter.get("/", getAllGroups); // Get all groups
groupsRouter.delete("/:id", deleteGroup); // Delete a group by ID
groupsRouter.put("/:id", EditGroup); // Edit a group by ID
module.exports = groupsRouter;
