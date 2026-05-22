const express = require("express");

const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils.js/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { authUser } = require("./middlewares/auth");

// Connect to MongoDB
connectDB();
app.use(express.json());
app.use(cookieParser());
//signup route
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    //validate signup data
    validateSignupData(req);
    //encrypt password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "ERROR: " + error.message });
  }
});

//login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      } else {
        //create a jwt token and send it in cookie
        const token = jwt.sign({ userId: user._id }, "Sant@123", {
          expiresIn: "1h",
        });
        //Add your JWT token generation logic here and set the cookie
        res.cookie("token", token);

        res.status(200).json({ message: "Login successful" });
      }
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//profile route
app.get("/profile", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(400).json({ message: error.message });
  }
});

// Get all users for feed
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get user by email
app.get("/users/:emailId", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.emailId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//delete user by id
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//update user by id
app.patch("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const data = req.body;
  try {
    const allowedUpdates = [
      "_id",
      "firstName",
      "lastName",
      "age",
      "gender",
      "skills",
    ];
    if (!Object.keys(data).every((key) => allowedUpdates.includes(key))) {
      return res.status(400).json({
        message: "Invalid updates",
      });
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
