const { unlink } = require("fs/promises");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const _ = require("lodash");

const { User, userValidator } = require("../models/User");
const Token = require("../models/Token");
const upload = require("../middleware/uploadImg");
const { findById, findOne } = require("../models/Token");

//get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send("Something goes wrong");
  }
});

//create a new user
router.post("/", async (req, res) => {
  const { error } = userValidator.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already exist");

  user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    isAdmin: req.body.isAdmin,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  const token = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();

  const storedToken = await new Token({
    token: refreshToken,
  });
  await storedToken.save();

  res.status(200).send({
    data: _.pick(user, ["_id", "email", "firstName", "lastName"]),
    token,
    refreshToken,
  });
});

//add or update profile image
//TODO add profile image routes
router.put("/me", [auth, upload.single("image")], async (req, res) => {
  if (!req.file) return res.status(400).send("You must send an image");

  const user = await User.findById(req.user._id);

  if (user.profileImage) {
    await unlink(user.profileImage);
    console.log("successfully deleted old image");
  }

  user.profileImage = req.file.path;
  await user.save();

  res
    .status(200)
    .send(_.pick(user, ["firstName", "lastName", "profileImage", "email"]));
});

module.exports = router;
