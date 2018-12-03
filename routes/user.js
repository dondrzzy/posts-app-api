const express = require('express');
var jwt = require('jsonwebtoken');
const userRouter = express.Router();
const User = require('../models/User');

userRouter.post('/register', (req, res) => {
  if (!req.body.email) {
    res.status(400).json({success:false, message: 'Email is required'});
  }else if (!req.body.password) {
    res.status(400).json({success:false, message: 'Password is required'});
  } else {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });
    console.log(req.body);
    user.save((err, result) => {
      if (err)
        // console.log('error', err);
        res.json({success: false, err});
      else
        console.log('result', result);
        res.status(201).json({success: true, message: 'User successfully registered'});
    });
  }
});

userRouter.post('/login', async (req, res) => {
  if (!req.body.email) {
    res.status(400).json({success:false, message: 'Email is required'});
  }else if (!req.body.password) {
    res.status(400).json({success:false, message: 'Password is required'});
  } else {
    const user = await User.findOne({email: req.body.email.toLowerCase()}).select('email password');
    if (!user) {
      res.status(404).json({success:false, message: 'User not found'});
      return;
    }
    if (user.password != req.body.password) {
      res.status(404).json({success:false, message: 'User not found'});
      return;
    }
    const payload = {id: user._id};
    const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn:86400});
    res.status(200).json({success: true, token, email: user.email});
  }
})

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
