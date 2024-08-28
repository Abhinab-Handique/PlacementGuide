
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  FullName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  Role:{
    type: String,
    required: true,
    enum: ['admin', 'user'],
    default: 'user'
  },
  ProfileImage:{
    type: String,
    required: true,
    default: './public/image/default.png',

  }
});

module.exports = mongoose.model('User', UserSchema);
