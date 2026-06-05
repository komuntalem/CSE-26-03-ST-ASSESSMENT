const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  quality: {
    type: String,
    required: true,
    enum: ['360p', '720p', '1080p'],
  },
  publishDate: {
    type: Date,
    required: true,
  },
  thumbnail: {
    type: String,
    trim: true,
  },
  videoFile: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Video', videoSchema);
