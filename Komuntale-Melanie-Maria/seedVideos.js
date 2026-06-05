require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Video = require('./models/video');

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/videx';

const seedVideos = async () => {
  await mongoose.connect(mongoUri);

  const thumbnailsDir = path.join(__dirname, '..', 'resources', 'Test Data', 'Thumbnails');
  if (!fs.existsSync(thumbnailsDir)) {
    console.error('Thumbnails folder not found:', thumbnailsDir);
    process.exit(1);
  }

  const files = fs.readdirSync(thumbnailsDir).filter((file) => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'));
  if (files.length === 0) {
    console.error('No thumbnail images found in:', thumbnailsDir);
    process.exit(1);
  }

  const videos = files.map((filename, index) => {
    const title = filename
      .replace(/^[0-9]+_/, '')
      .replace(/\.[^.]+$/, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (match) => match.toUpperCase());

    return {
      title,
      description: `A sample video about ${title}.`,
      quality: ['360p', '720p', '1080p'][index % 3],
      publishDate: new Date(Date.now() - index * 86400000),
      thumbnail: filename,
      videoFile: '',
    };
  });

  await Video.deleteMany({});
  await Video.insertMany(videos);
  console.log(`Seeded ${videos.length} videos to MongoDB.`);
  await mongoose.disconnect();
};

seedVideos().catch((error) => {
  console.error(error);
  process.exit(1);
});
