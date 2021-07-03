const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: process.env.JWT_REFRESH_TOKEN_TIME,
    default: Date.now,
  },
});

module.exports = mongoose.model("Token", tokenSchema);
