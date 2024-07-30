const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  actual_tokens: {
    type: Number,
    default: 50
  },
  using_tokens: {
    type: Number,
    default: 50
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, { collection: 'user' });

module.exports = mongoose.model('Users', userSchema);
