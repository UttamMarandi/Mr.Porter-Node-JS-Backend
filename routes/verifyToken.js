const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  //middleware so access to these variables
  const authHeader = req.headers.token; //we are accessing the headers of req object token is key
  if (authHeader) {
    const token = authHeader.split(" ")[1]; //we have added Beared and space by ourselves , so we need to split to get the original token
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json("Token is not valid");
      else {
        req.user = user; //we are adding a new object to the content we are sending to server. similar to req.body , req.header
        next();
      }
    }); //this function gets the token from the headers object and verify it with sec key
  } else {
    return res.status(401).json("You are not authenticated");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    //after verifyToken has run , run this method
    if (req.user.id === req.params.id) {
      next();
    } else {
      res.status(403).json("YOu are not allowed to do that");
    }
  });
};

//for order.js and product.js only users can make changes to these files.

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    //after verifyToken has run , run this method
    if (req.user.isAdmin) {
      //is user is admin move next()
      next();
    } else {
      res.status(403).json("YOu are not allowed to do that");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
}; //using object b.c we will be creating multiple funcitons
