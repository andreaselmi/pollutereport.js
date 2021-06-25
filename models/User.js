const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
  isAdmin: Joi.boolean(),
});

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    min: 6,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.ACCESS_TOKEN_SECRET
  );
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = { User, userValidator };
