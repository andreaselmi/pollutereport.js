const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: "7d",
    default: Date.now,
  },
});

module.exports = mongoose.model("Token", tokenSchema);
