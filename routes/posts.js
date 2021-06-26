const router = require("express").Router();
const auth = require("../middlewares/auth");

const { Post, postValidator } = require("../models/Post");
const { User } = require("../models/User");

router.get("/", (req, res) => {
  res.status(200).send("Post page");
});

router.post("/", auth, async (req, res) => {
  const { error } = postValidator.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findById(req.user._id);

  let post = new Post({
    title: req.body.title,
    description: req.body.description,
    address: {
      city: req.body.address.city,
      country: req.body.address.country,
      street: req.body.address.street,
      position: req.body.address.position,
    },
    image: req.body.image,
    author: user._id,
  });

  try {
    post = await post.save();
    await user.updateOne({ $push: { posts: post._id } });
    res.status(200).send(post);
  } catch (error) {
    //TODO error handler
    res.status(500).send("Something goes wrong");
  }
});

module.exports = router;
