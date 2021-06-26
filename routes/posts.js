const router = require("express").Router();

const { Post, postValidator } = require("../models/Post");

router.get("/", (req, res) => {
  res.status(200).send("Post page");
});

module.exports = router;
