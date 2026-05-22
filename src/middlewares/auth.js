const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Token is Invalid");
    }
    const decodedMessage = jwt.verify(token, "Sant@123");
    const { userId } = decodedMessage;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  authUser,
};
