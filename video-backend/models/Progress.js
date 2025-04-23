// backend/models/Progress.js
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoId: {
    type: String,
    required: true
  },
  watched: {
    type: [Number],   // list of watched seconds
    default: []
  },
  currentTime: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
