const mongoose = require("mongoose");
const Joi = require("joi");

const postValidator = Joi.object({
  title: Joi.string().required().min(2).max(50),
  description: Joi.string().max(255),
  image: Joi.string().required().max(255),
  address: {
    city: Joi.string().required().min(2).max(50),
    country: Joi.string().required().min(2).max(50),
    street: Joi.string().required().min(2).max(50),
    position: Joi.string(),
  },
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  description: {
    type: String,
    max: 255,
  },
  address: {
    type: new mongoose.Schema({
      city: {
        type: String,
        required: true,
        min: 2,
        max: 50,
      },
      country: {
        type: String,
        required: true,
        min: 2,
        max: 50,
      },
      street: {
        type: String,
        required: true,
        min: 2,
        max: 50,
      },
      position: String,
    }),
    required: true,
  },
  image: {
    type: String,
    required: true,
    max: 255,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = { Post, postValidator };
