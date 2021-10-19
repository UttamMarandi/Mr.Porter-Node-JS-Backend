const mongoose = require("mongoose");

const CartSchema = mongoose.Schema(
  {
    //defining the schema of our varibales.
    userId: { type: String, required: true, unique: true }, //username is of type string , it is required and should be unique
    products: [
      {
        prosuctId: { type: String },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  {
    timestamps: true, //genearates created at and updated at timestamps
  }
);

module.exports = mongoose.model("User", CartSchema); //exporting the model
