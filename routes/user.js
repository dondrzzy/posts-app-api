const express = require('express');
var jwt = require('jsonwebtoken');
const userRouter = express.Router();
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/User');

userRouter.post('/register', (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({success:false, message: 'Email is required'});
  }
  if (!req.body.password) {
    return res.status(400).json({success:false, message: 'Password is required'});
  }
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    description: req.body.description,
  });
  user.save((err, result) => {
    if (err) {
      console.log('error', err.errors.name.message)
      return res.json({success: false, err});
    }
    return res.status(201).json({success: true, message: 'User successfully registered'});
  });
});

userRouter.post('/login', async (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({success:false, message: 'Email is required'});
  }
  if (!req.body.password) {
    return res.status(400).json({success:false, message: 'Password is required'});
  }
  const user = await User.findOne({email: req.body.email.toLowerCase()}).select('email password');
  if (!user) {
    return res.status(404).json({success:false, message: 'User not found'});
  }
  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if(!result)
      return res.status(401).json({success: false, message: 'Email or password invalid'})
    const payload = {id: user._id};
    const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn:86400});
    return res.status(200).json({success: true, token, email: user.email});
  });
});

userRouter.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-__v');
    res.status(200).json({success: true, users});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

userRouter.get('/profile/:id', (req, res) => {
    User.findById(req.params.id, '-__v', (err, user) => {
      if (err)
        console.log(err.code);
      if (!user) {
        res.status(404).json({success: false, message: 'User not found'});
        return;
      }
      res.status(200).json({success: true, user});
    });
});

module.exports = userRouter;
