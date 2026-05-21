const express = require("express");

const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

// Connect to MongoDB
connectDB();
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Create a new user
    const user = new User({ firstName, lastName, email, password });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
