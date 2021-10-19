const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
dotenv.config(); //required

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connections sucessful");
  })
  .catch((err) => {
    console.log(err);
  });
//it's a promise

app.use(express.json()); //to allow server to receive any json file
app.get("/", (req, res) => {
  console.log("Hello");
  res.send("Hello");
});

//routes
app.get("/api/test", () => {
  console.log("Test successful");
});
app.use("/api/users", userRoute);

app.use("/api/auth", authRoute);

app.listen(process.env.PORT || 5000, () => {
  //if no port no. defined in env file than use 5000
  console.log("server running port 5000");
});
