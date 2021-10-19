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
