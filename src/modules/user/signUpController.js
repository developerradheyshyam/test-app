const UserSchema = require("./userSchema.js");
const bcryptjs = require("bcryptjs");

const signUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Incomplete Input" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid Email Format" });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if the user already exists
    const existingUser = await UserSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password.trim(), 10);

    // Create a new user
    const newUser = new UserSchema({
      name,
      email,
      password: hashedPassword,
      role: role || "admin", // Default role if not provided
    });

    // Save the user to the database
    await newUser.save();

    // Success response
    return res.status(201).json({ message: "Successfully Signed Up" });
  } catch (error) {
    console.error("Error during sign-up:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { signUp };
