const mongoose = require('mongoose');
const { urlRegex } = require('../utils/consts');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        const regex = urlRegex;
        return regex.test(v);
      },
      message: () => 'is not a valid url',
    },
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
