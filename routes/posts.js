const express = require('express');
const postsRouter = express.Router();
var jwt = require('jsonwebtoken');
const Post = require('../models/post');

function checkAuthenticated(req, res, next) {
  if(!req.header('authorization')) {
    return res.status(401).json({success: false, message: 'Unauthorized: Missing auth header'});
  }
  let token = req.header('authorization').split(' ')[1];
  jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
    if(err){res.json({success:false, token: false, message:'Token Invalid '+err});}
    else{//user passed and add a global variable
        req.decoded = decoded;
        next(); 
    }
  });
}

postsRouter.get('/user/:id', (req, res) => {
  Post.find({userId: req.params.id}, (err, posts) => {
    if(err)
      return res.status(500).json({success: false, err});
    return res.status(200).json({success: true, posts});
  });
});



postsRouter.use((req, res, next) => {
    
  const token = req.header('authorization').split(' ')[1];
  console.log('token', token);
  
  if(!token){
      res.json({success:false, message:'No token provided'});
  }else{
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
      if(err){res.json({success:false, token: false, message:'token Invalid '+err});}
      else{//user passed and add a global variable
          req.decoded = decoded;
          next(); 
      }
    });
  }
});

postsRouter.post('/', (req, res) => {
  if (!req.body.message) {
    return res.status(400).json({
      success: false,
      message: 'A message s required',
    });
  }
  console.log('sd', req.decoded);
  const post = new Post({
    message: req.body.message,
    userId: req.decoded.sub,
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

postsRouter.get('/', (req, res) => {
  console.log(req.decoded);
  Post.find({userId: req.decoded.sub}, (err, posts) => {
    if(err)
      return res.status(500).json({success: false, err});
    return res.status(200).json({success: true, posts});
  });
});

module.exports = postsRouter;
