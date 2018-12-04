var mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
  message: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Post', PostSchema);
