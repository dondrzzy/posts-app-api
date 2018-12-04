var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
});

UserSchema.pre('save', function(next) {
  var user = this;
  if(!user.isModified('password'))
    return next();

  bcrypt.hash(user.password, null, null, (err, hash) => {
    if(err) return next(err);
    console.log('hash', hash);
    user.password = hash;
    next();
  })
})

module.exports = mongoose.model('User', UserSchema);
