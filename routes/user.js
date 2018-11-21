const express = require('express');
const userRouter = express.Router();
const User = require('../models/User');

userRouter.post('/', (req, res) => {
  if (!req.body.email) {
    res.status(400).json({success:false, message: 'Email is requires'});
  }
  if (!req.body.password) {
    res.status(400).json({success:false, message: 'Password is requires'});
  }
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });
  console.log(user);
  user.save((err, result) => {
    if (err)
      res.json({success: false, error});
    res.status(201).json({success: true, message: 'User successfully registered'});
  });
});

module.exports = userRouter;
