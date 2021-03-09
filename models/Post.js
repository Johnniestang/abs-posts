const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  body: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// eslint-disable-next-line no-undef
module.exports = Post = mongoose.model('post', PostSchema);
