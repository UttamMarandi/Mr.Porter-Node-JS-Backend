const User = require("../models/User");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

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

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }); //async process
    //In case of register we are saving the client input data. But in case of login we are first trying to find the username in the db using findOne. findOne works good as username is uinque and we are trying to match the username with the req.username
    if (!user) {
      return res.status(401).json("Wrong Credentials"); //if user not found return response
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    ); //hashed password
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8); //pass parameter
    if (OriginalPassword != req.body.password) {
      return res.status(401).json("Wrong Credentials");
      //if password do no match return response
    }

    const { password, ...others } = user._doc; //spread operator , send everything except password to the client ._doc b.c mongo db store data in this Object
    //access Token
    const accessToken = jwt.sign(
      {
        //we need these properties for admin users
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" } //after 3 days we need to login again
    );

    return res.status(200).json({ ...others, accessToken }); //along with data we are passing the accessToken
    //passing single object accestoken is added to others , spread operator
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

//Bug fix
//Cannot set headers after they are sent to the client
//solution : use if conditions and return statements
