const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { User } = require("../models/User");
const Token = require("../models/Token");

router.post("/", (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    return res.status(400).send("A valid refresh token is required");
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      if (err) {
        return res.status(400).send("Invalid Refresh Token");
      }

      const isValidRefreshToken = await Token.findOne({ token: refreshToken });
      if (isValidRefreshToken) {
        const currentUser = await User.findOne({ _id: user._id });
        //TODO verificare correttezza
        const token = currentUser.generateAuthToken();
        return res.status(201).send(token);
      } else {
        return res.status(401).send("Refresh token has expired");
      }
    }
  );
});

module.exports = router;
