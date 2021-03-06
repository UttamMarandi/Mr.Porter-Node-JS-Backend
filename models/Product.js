const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    //defining the schema of our varibales.
    title: { type: String, required: true }, //username is of type string , it is required and should be unique
    desc: { type: String, required: true },
    img: { type: String, required: true },
    categories: { type: Array, required: true },
    size: { type: Array, required: true },
    color: { type: Array, required: true },
    price: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    // isAdmin: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  {
    timestamps: true, //genearates created at and updated at timestamps
  }
);

module.exports = mongoose.model("Product", ProductSchema); //exporting the model
