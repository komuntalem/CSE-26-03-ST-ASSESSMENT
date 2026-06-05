require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Video = require('./models/video');

const app = express();

// Create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({ storage });

// Serve static files from public
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Pug as the templating engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/videx';

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.redirect('/home');
});

app.get('/home', (req, res) => {
  res.render('landing');
});

app.get('/addvideo', (req, res) => {
  res.redirect('/videos/add');
});

app.get('/videos', async (req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 });
  res.render('dashboard', { videos });
});

app.get('/videos/add', (req, res) => {
  res.render('addvideo', { errors: {}, old: {} });
});

app.get('/videos/:id', async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    return res.status(404).send('Video not found');
  }
  res.render('watch', { video });
});

app.get('/dashboard', (req, res) => {
  res.redirect('/videos');
});

app.post('/videos/add', upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]), async (req, res) => {
  const body = req.body || {};
  const { title, description, quality, publishDate } = body;
  const errors = {};

  if (!title) errors.title = 'Title is required';
  if (!quality) errors.quality = 'Quality is required';
  if (!publishDate) errors.publishDate = 'Publish date is required';

  const videoFile = req.files?.videoFile?.[0];
  const thumbnailFile = req.files?.thumbnail?.[0];

  if (!videoFile) errors.videoFile = 'Video file is required';
  if (!thumbnailFile) errors.thumbnail = 'Thumbnail is required';

  if (Object.keys(errors).length > 0) {
    return res.status(400).render('addvideo', { errors, old: req.body });
  }

  const video = new Video({
    title,
    description,
    quality,
    publishDate,
    videoFile: videoFile.filename,
    thumbnail: thumbnailFile.filename,
  });

  await video.save();
  res.redirect('/videos');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});