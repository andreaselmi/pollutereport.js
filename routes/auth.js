const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");

const { User } = require("../models/User");
const Token = require("../models/Token");

const schema = Joi.object({
  email: Joi.string().max(255).email().required(),
  password: Joi.string().min(6).max(255).required(),
});

router.post("/", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();
  // TODO send refresh token
  const refreshToken = user.generateRefreshToken();
  const storedToken = await new Token({
    token: refreshToken,
  });
  await storedToken.save();

  res.send({
    token,
    refreshToken,
  });
});

module.exports = router;
