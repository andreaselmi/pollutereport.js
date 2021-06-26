const mongoose = require("mongoose");
const router = require("express").Router();
const auth = require("../middlewares/auth");
const validateObjId = require("../middlewares/validateObjId");

const { Post, postValidator } = require("../models/Post");
const { User } = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("author");
    res.send(posts);
  } catch (error) {
    //TODO error handler
    res.status(500).send("Something goes wrong");
  }
});

//create new post
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

//Delete post
router.delete("/:id", [auth, validateObjId], async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found");

  //TODO migliorare

  if (post.author !== req.user._id && !req.user.isAdmin)
    return res.status(401).send("You can delete only your post");

  try {
    await post.remove();
    res.send(post);
  } catch (error) {
    //TODO error handler
    res.status(500).send("Something goes wrong");
  }
});

//Update post
router.put("/:id", [auth, validateObjId], async (req, res) => {});

module.exports = router;
