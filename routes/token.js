const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.status(400).send("User not authenticated");
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (!err) {
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10m",
      });
      return res.status(201).send(accessToken);
    } else {
      return res.status(400).send("User not authenticated");
    }
  });
});

module.exports = router;
