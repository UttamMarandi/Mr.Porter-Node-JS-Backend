const router = require("express").Router();
const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
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

module.exports = router;
