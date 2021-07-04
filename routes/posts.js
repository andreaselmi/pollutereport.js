const router = require("express").Router();
const auth = require("../middleware/auth");
const validateObjId = require("../middleware/validateObjId");
const upload = require("../middleware/uploadImg");

const { Post, postValidator } = require("../models/Post");
const { User } = require("../models/User");

router.get("/", async (req, res, next) => {
  if (Object.keys(req.query).length === 0) {
    const posts = await Post.find().populate("author");
    res.send(posts);
  } else if (req.query.city) {
    const posts = await Post.find({
      "address.city": new RegExp("^" + req.query.city + "$", "i"),
    });

    if (posts.length === 0) {
      return res.status(404).send("There are no reports in this city");
    }

    res.status(200).send(posts);
  } else {
    res.status(400).send("You can only search with the name of a city");
  }
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
  // TODO error handling all await status
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found");

  //TODO migliorare
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

  // TODO migliorare
  if (String(post.author) !== String(req.user._id)) {
    return res.status(401).send("You are not authorized to modify this post");
  }

  const { error } = postValidator.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  await post.updateOne({
    $set: req.body,
  });

  res.status(200).send(post);
});

module.exports = router;
