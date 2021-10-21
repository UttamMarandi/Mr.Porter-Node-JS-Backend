const router = require("express").Router();
const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../routes/verifyToken");
const { route } = require("./auth");

//Update User
//as my understanding the put method allows user to update something in db let's say username. so the req.body will contain the new username. req.headers will contain the token to validate the user.
//the response from server will contain the upadated user with updated name

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    //user might change the password , so we need to make sure that he/she is still logged in
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    ); //
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE USER
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id); //findByIdAndDelete is a mongo db  function. params.id contains the usrl path , in our case it is the id of the user.
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  //only the admin has access to user props
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc; //send everything except password
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USERS

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  //"api/users" only route for all users
  //only the admin has access to user props

  try {
    const query = req.query.new; //in url anything after ? is a query
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5) //if new is set to true , then list in desc order using _id : -1
      : await User.find();
    // const users = await User.find();
    // const { password, ...others } = user._doc; //send everything except password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user stats
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1)); //get the last year date wrt to date and set the date as last year
  try {
    const data = await User.aggregate([
      //aggregate mongodb method
      { $match: { createdAt: { $gte: lastYear } } }, //basically give me all the matches where createdAt  greater than last year.
      { $project: { month: { $month: "$createdAt" } } }, //
      { $group: { _id: "$month", total: { $sum: 1 } } }, //_id returns the month it is created , total returns the no of entries for that month
      //fc
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(`User stats error ${err}`);
  }
});

module.exports = router;
