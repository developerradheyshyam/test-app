const Group = require("./groupsSchema.js");

const creategroup = async (req, res) => {
  console.log(req.body);
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Create a new contact
    const newGroup = new Group({
      name: name,
    });

    await newGroup.save();

    res.status(201).json(newGroup);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const EditGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedGroup = await Group.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    res
      .status(200)
      .json({ message: "Group updated successfully", group: updatedGroup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { creategroup, getAllGroups, deleteGroup, EditGroup };
