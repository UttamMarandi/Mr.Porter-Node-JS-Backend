const User = require("../models/User");
const router = require("express").Router();
const CryptoJS = require("crypto-js");

//REGISTER
router.post("/register", async (req, res) => {
  //contains async task so async, receiving and saving data to db are async process
  //user is sending data to register so "POST"
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(), //CryptoJS will encrypt the provided password. Even in db we store the password encrypted, also convert to string b.c password of String type in model
  }); //getting the model
  try {
    const savedUser = await newUser.save(); //this save the client data to db
    res.status(201).json(savedUser);
  } catch (err) {
    console.log(err); //logs any err
    res.status(500).json(err);
  }
});

module.exports = router;
