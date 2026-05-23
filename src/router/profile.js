const express = require("express");
const { authUser } = require("../middlewares/auth");
const profileRouter = express.Router();

profileRouter.get("/profile", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = profileRouter;
