const express = require("express");
const { authUser } = require("../middlewares/auth");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const { validateStrongPassword } = require("../utils.js/validation");

profileRouter.get("/profile/view", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(400).json({ message: error.message });
  }
});

profileRouter.patch("/profile/update", authUser, async (req, res) => {
  try {
    const user = req.user;
    const { firstName, lastName, email } = req.body;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(400).json({ message: error.message });
  }
});

profileRouter.patch("/profile/password", authUser, async (req, res) => {
  try {
    const user = req.user;
    const { currentPassword, newPassword } = req.body;
    const isPasswordValid = await user.validatePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    validateStrongPassword(newPassword);
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.password = newPasswordHash;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = profileRouter;
