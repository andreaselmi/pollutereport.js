const router = require("express").Router();
const bcrypt = require("bcrypt");

const { User, userValidator } = require("../models/User");

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
    email: req.body.email,
    password: req.body.password,
    isAdmin: req.body.isAdmin,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  const token = user.generateAuthToken();

  res.status(200).header("x-auth-token", token).send({
    email: user.email,
    id: user._id,
  });
});

//modify user

//delete a user by id
//TODO
// router.delete("/:id", (req, res) => {});

module.exports = router;