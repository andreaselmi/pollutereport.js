const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");

const { User } = require("../models/User");
const Token = require("../models/Token");
const logger = require("../helpers/logger");

const schema = Joi.object({
  email: Joi.string().max(255).email().required(),
  password: Joi.string().min(6).max(255).required(),
});

router.post("/", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user;
  try {
    user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");
  } catch (error) {
    logger.error(error.message);
    return res.send({ error: error.message });
  }

  try {
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password");
  } catch (error) {
    logger.error(error.message);
    return res.send({ error: error.message });
  }

  const token = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();
  try {
    const storedToken = await new Token({
      token: refreshToken,
    });
    await storedToken.save();

    res.status(200).send({
      token,
      refreshToken,
    });
  } catch (error) {
    logger.error(error.message);
    return res.send({ error: error.message });
  }
});

module.exports = router;
