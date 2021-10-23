const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    //defining the schema of our varibales.
    title: { type: String, required: true, unique: true }, //username is of type string , it is required and should be unique
    products: [
      {
        prosuctId: { type: String },
      },
    ],
  },
  {
    timestamps: true, //genearates created at and updated at timestamps
  }
);

module.exports = mongoose.model("User", ProductSchema); //exporting the model

//product
const mongoose = require("mongoose");

const CartSchema = mongoose.Schema(
  {
    //defining the schema of our varibales.
    title: { type: String, required: true }, //username is of type string , it is required and should be unique
    desc: { type: String, required: true },
    img: { type: String, required: true },
    categories: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, //genearates created at and updated at timestamps
  }
);

module.exports = mongoose.model("User", CartSchema); //exporting the model

const accessToken = jwt.sign(
  {
    id: user._id,
    isAdmin: user.isAdmin,
  },
  process.env.JWT_SEC,
  { expiresIn: "3d" }
);
const accessToken = jwt.sign(
  {
    //we need these properties for admin users
    id: user_id,
    isAdmin: user.isAdmin,
  },
  process.env.JWT_SEC,
  { expiresIn: "3d" } //after 3 days we need to login again
);

if (req.user.id === req.params.id) {
}

//All Products

router.get("/", async (req, res) => {
  //"api/Products" only route for all users
  //only the admin has access to user props
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

//CREATE
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save(); //saves the product to db
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Order.js
const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
  {
    //defining the schema of our varibales.
    userId: { type: String, required: true }, //username is of type string , it is required and should be unique
    products: [
      {
        productId: { type: String },
        quantity: { type: Number, default: 1 },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "pending" },
  },
  {
    timestamps: true, //genearates created at and updated at timestamps
  }
);

module.exports = mongoose.model("Order", OrderSchema); //exporting the model

//Order.js Entire Page
const router = require("express").Router();
const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//Create Order
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Update Product
//as my understanding the put method allows product to update something in db let's say username. so the req.body will contain the new username. req.headers will contain the token to validate the user.
//the response from server will contain the upadated user with updated name

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    ); //
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE PRODUCT
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id); //findByIdAndDelete is a mongo db  function. params.id contains the usrl path , in our case it is the id of the user.
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER ORDERS
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  //user id not the cart id

  try {
    const orders = await Order.findOne({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL CART
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = Order.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//STATS
//get monthly income
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

//Model Order.js
const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
  {
    //defining the schema of our varibales.
    userId: { type: String, required: true }, //username is of type string , it is required
    products: [
      {
        productId: { type: String },
        quantity: { type: Number, default: 1 },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "pending" },
  },
  {
    timestamps: true, //genearates created at and updated at timestamps
  }
);

module.exports = mongoose.model("Order", OrderSchema); //exporting the model
