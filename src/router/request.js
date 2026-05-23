const express = require("express");
const { authUser } = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", authUser, async (req, res) => {
  try {
    const user = req.user;
    const name = user.firstName + " " + user.lastName;
    res
      .status(200)
      .json({ message: name + " Connection request sent successfully" });
  } catch (error) {
    console.error("Error sending connection request:", error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = requestRouter;
