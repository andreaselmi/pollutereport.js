const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { User } = require("../models/User");

router.post("/", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.status(400).send("User not authenticated");
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      if (err) {
        return res.status(400).send("User not authenticated");
      }

      const currentUser = await User.findOne({ _id: user._id });

      const token = currentUser.generateAuthToken();
      return res.status(201).send(token);
    }
  );
});

module.exports = router;
