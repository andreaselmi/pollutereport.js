const router = require("express").Router();
const auth = require("../middleware/auth");
const validateObjId = require("../middleware/validateObjId");

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
    await user.updateOne({ $push: { posts: { _id: post._id } } });
    res.status(200).send(post);
  } catch (error) {
    //TODO error handler
    res.status(500).send("Something goes wrong");
  }
});

//Delete post
router.delete("/:id", [auth, validateObjId], async (req, res) => {
  // TODO error handling all await status
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found");

  //TODO migliorare
  if (String(post.author) !== String(req.user._id) && !req.user.isAdmin)
    return res.status(401).send("You are not authorized to delete this post");

  try {
    await User.findByIdAndUpdate(post.author, {
      $pull: { posts: { _id: post._id } },
    });
    await post.remove();
    res.send(post);
  } catch (error) {
    //TODO error handler
    console.log(error);
    res.status(500).send("Something goes wrong");
  }
});

//Update post
router.put("/:id", [auth, validateObjId], async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found");

  // TODO migliorare
  if (String(post.author) !== String(req.user._id)) {
    return res.status(401).send("You are not authorized to modify this post");
  }

  const { error } = postValidator.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    await post.updateOne({
      $set: req.body,
    });

    res.status(200).send(post);
  } catch (error) {
    //TODO
    res.status(500).send("Try again");
  }
});

module.exports = router;
