const express = require("express");
const { authAdmin, authUser } = require("./middlewares/auth");

const app = express();

app.use("/admin", authAdmin);

app.get("/user/login", (req, res) => {
  res.send("User login logged in successfully");
});

app.get("/user/data", authUser, (req, res) => {
  res.send("User data endpoint");
});

app.get("/admin/getUserData", (req, res) => {
  res.send("Get User data for admin");
});
app.get("/admin/deleteUser", (req, res) => {
  res.send("Delete user endpoint for admin");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
