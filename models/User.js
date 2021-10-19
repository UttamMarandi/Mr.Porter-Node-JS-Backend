const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    //defining the schema of our varibales.
    username: { type: String, required: true, unique: true }, //username is of type string , it is required and should be unique
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, //genearates created at and updated at timestamps
  }
);

module.exports = mongoose.model("User", UserSchema); //exporting the model
