const express = require('express');
const path = require('path');
const app = express();

// Set Pug as the templating engine
app.set('view engine', 'pug');

// Optional: Specify a custom directory for Pug views
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('landing');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});