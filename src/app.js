const express = require("express");

const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./router/auth");
const profileRouter = require("./router/profile");
const requestRouter = require("./router/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

// Connect to MongoDB
connectDB();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
