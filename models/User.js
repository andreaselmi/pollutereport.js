const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userValidator = Joi.object({
  firstName: Joi.string().required().min(3).max(50),
  lastName: Joi.string().required().min(3).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
  isAdmin: Joi.boolean(),
});

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    min: 3,
    max: 50,
  },
  lastName: {
    type: String,
    required: true,
    min: 3,
    max: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    min: 3,
    max: 50,
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
