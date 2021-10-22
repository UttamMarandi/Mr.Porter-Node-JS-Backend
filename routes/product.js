const router = require("express").Router();
const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save(); //saves the product to db
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Update Product
//as my understanding the put method allows product to update something in db let's say username. so the req.body will contain the new username. req.headers will contain the token to validate the user.
//the response from server will contain the upadated user with updated name

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    ); //
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE PRODUCT
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id); //findByIdAndDelete is a mongo db  function. params.id contains the usrl path , in our case it is the id of the user.
    res.status(200).json("product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PODUCT
router.get("/find/:id", async (req, res) => {
  //no middleware as everybody can see product
  //only the admin has access to user props
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL PRODUCTS
//All Products

router.get("/", async (req, res) => {
  //"api/Products" only route for all products

  const qNew = req.query.new;
  const qCategory = req.query.category;
  //in url anything after ? is a query

  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
