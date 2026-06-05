const express = require('express');
const path = require('path');
const app = express();

// Serve static files from public
app.use(express.static(path.join(__dirname, 'public')));

// Set Pug as the templating engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const videos = [];

app.get('/', (req, res) => {
  res.redirect('/home');
});

app.get('/home', (req, res) => {
  res.render('landing');
});

app.get('/addvideo', (req, res) => {
  res.redirect('/videos/add');
});

app.get('/videos', (req, res) => {
  res.render('dashboard', { videos });
});

app.get('/videos/add', (req, res) => {
  res.render('addvideo', { errors: {}, old: {} });
});

app.get('/videos/:id', (req, res) => {
  const video = videos.find((item) => item.id === req.params.id);
  if (!video) {
    return res.status(404).send('Video not found');
  }
  res.render('watch', { video });
});

app.get('/dashboard', (req, res) => {
  res.redirect('/videos');
});

app.post('/videos/add', (req, res) => {
  // For simplicity, we won't handle actual file uploads in this example
  const { title, quality, publishDate } = req.body;

  // Simple validation
  if (!title || !quality || !publishDate) {
    return res.status(400).render('addvideo', { errors: { title, quality, publishDate }, old: req.body });
  }

  // Create a new video object (in a real app, you'd save this to a database)
  const video = {
    id: Date.now().toString(),
    title,
    quality,
    publishDate
  };

  videos.push(video);
  res.redirect('/videos');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});