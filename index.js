const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const paymentRoute = require("./routes/stripe");

dotenv.config(); //required for env variables to work

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
app.use(cors());

app.use("/api/users", userRoute);

app.use("/api/auth", authRoute);

app.use("/api/products", productRoute);

app.use("/api/cart", cartRoute);

app.use("/api/orders", orderRoute);

app.use("/api/checkout", paymentRoute);

app.get("/", (req, res) => {
  console.log("Hello");
  res.send("Hello");
});
//routes
app.get("/api/test", () => {
  console.log("Test successful");
});
app.listen(process.env.PORT || 5000, () => {
  //if no port no. defined in env file than use 5000
  console.log("server running port 5000");
});
