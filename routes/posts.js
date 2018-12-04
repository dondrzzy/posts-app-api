const express = require('express');
const postsRouter = express.Router();
const Post = require('../models/post');

postsRouter.post('/', (req, res) => {
  if (!req.body.message) {
    return res.status(400).json({
      success: false,
      message: 'A message s required',
    });
  }
  const post = new Post({
    message: req.body.message,
  });
  post.save((err, result) => {
    if (err)
      return res.status(500).json({success: false, err})
    return res.status(201).json({
      success: true,
      message: 'Post successfully created',
    });
  });
});

module.exports = postsRouter;
