const router = require("express").Router();
const auth = require("../middleware/auth");
const validateObjId = require("../middleware/validateObjId");
const upload = require("../middleware/uploadImg");
const mongoose = require("mongoose");

const { Post, postValidator } = require("../models/Post");
const { User } = require("../models/User");

//Get all posts (default 10 by 10 from page 1)
router.get("/", async (req, res, next) => {
  const limitPosts = Number(req.query.pageLimit) || 10;
  const pageNumber = Number(req.query.pageNumber) || 1;

  const posts = await Post.find()
    .populate("author")
    .skip((pageNumber - 1) * limitPosts)
    .limit(limitPosts);
  return res.status(200).send(posts);
});

//search post by city or authorId or both
router.get("/search", validateObjId, async (req, res, next) => {
  if (Object.keys(req.query).length === 0) {
    return res.status(400).send("Nothing to search");
  }

  if (req.query.city && req.query.authorId) {
    if (!mongoose.Types.ObjectId.isValid(req.query.authorId)) {
      return res.status(404).send("Invalid Author ID");
    }
    const posts = await Post.find({
      "address.city": new RegExp("^" + req.query.city + "$", "i"),
      author: req.query.authorId,
    });

    if (posts.length === 0) {
      return res.status(404).send("No Results");
    }

    return res.status(200).send(posts);
  }

  if (req.query.city) {
    const posts = await Post.find({
      "address.city": new RegExp("^" + req.query.city + "$", "i"),
    });

    if (posts.length === 0) {
      return res.status(404).send("There are no reports in this city");
    }

    return res.status(200).send(posts);
  }

  if (req.query.authorId) {
    if (!mongoose.Types.ObjectId.isValid(req.query.authorId)) {
      return res.status(404).send("Invalid ID");
    }

    const posts = await Post.find({ author: req.query.authorId });
    if (posts.length === 0) {
      return res.status(404).send("There are no reports for this author");
    }

    return res.status(200).send(posts);
  }
  return res.status(400).send("Please insert a valid query");
});

//get post by id
router.get("/:id", validateObjId, async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).send("No report found");

  return res.status(200).send(post);
});

//create new post
router.post("/", [auth, upload.single("image")], async (req, res) => {
  const { error } = postValidator.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (!req.file) return res.status(400).send("Your post must have an image");

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
    author: user._id,
    image: req.file.path,
  });

  post = await post.save();
  await user.updateOne({ $push: { posts: { _id: post._id } } });
  res.status(200).send(post);
});

//Delete post
router.delete("/:id", [auth, validateObjId], async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found");

  if (String(post.author) !== String(req.user._id) && !req.user.isAdmin)
    return res.status(401).send("You are not authorized to delete this post");

  await User.findByIdAndUpdate(post.author, {
    $pull: { posts: { _id: post._id } },
  });
  await post.remove();
  res.send(post);
});

//Update post
router.put("/:id", [auth, validateObjId], async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found");

  if (String(post.author) !== String(req.user._id)) {
    return res.status(401).send("You are not authorized to edit this post");
  }

  const { error } = postValidator.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  await post.updateOne({
    $set: req.body,
  });

  res.status(200).send(post);
});

module.exports = router;
