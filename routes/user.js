const express = require("express");
const router = express.Router();

router.get("/usertest", (req, res) => {
  res.send("User test is sucessful");
});

module.exports = router;
router.post("/userposttest", (req, res) => {
  const username = req.body.username;
  console.log(username);
  res.send(`Your username is ${username}`);
});
