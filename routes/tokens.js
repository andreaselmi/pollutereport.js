const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { User } = require("../models/User");
const Token = require("../models/Token");

router.post("/", (req, res) => {
  const refreshToken = req.header("X-auth-refresh-token");
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

      const isValidRefreshToken = await Token.findOne({ token: refreshToken });
      if (isValidRefreshToken) {
        const currentUser = await User.findOne({ _id: user._id });
        //TODO verificare correttezza
        const token = currentUser.generateAuthToken();
        return res.status(201).send(token);
      } else {
        return res.status(401).send("Invalid refresh token");
      }
    }
  );
});

module.exports = router;
