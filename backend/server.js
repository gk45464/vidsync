// server.js

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 5000;

// Set up storage for video uploads
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const videoUpload = multer({ storage: videoStorage });

// Set up storage for subtitle uploads
const subtitleStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/subtitles');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const subtitleUpload = multer({ storage: subtitleStorage });

app.use(express.json());

// Serve uploaded videos and subtitles
app.use('/videos', express.static(path.join(__dirname, 'uploads/videos')));
app.use('/subtitles', express.static(path.join(__dirname, 'uploads/subtitles')));

// API endpoint to receive uploaded video
app.post('/api/upload-video', videoUpload.single('video'), (req, res) => {
  res.json({ success: true, message: 'Video uploaded successfully' });
});

// API endpoint to receive subtitles and associate them with the video
app.post('/api/upload-subtitles', subtitleUpload.single('subtitles'), (req, res) => {
  const { videoId, subtitles } = req.body;

  // Store subtitles data in a file
  const subtitlesFilePath = `uploads/subtitles/${videoId}.json`;
  fs.writeFileSync(subtitlesFilePath, JSON.stringify(subtitles));

  res.json({ success: true, message: 'Subtitles uploaded and associated with the video' });
});

// API endpoint to retrieve subtitles associated with a video
app.get('/api/get-subtitles/:videoId', (req, res) => {
  const videoId = req.params.videoId;
  const subtitlesFilePath = `uploads/subtitles/${videoId}.json`;

  try {
    const subtitles = JSON.parse(fs.readFileSync(subtitlesFilePath, 'utf-8'));
    res.json({ success: true, subtitles });
  } catch (error) {
    res.json({ success: false, message: 'Subtitles not found for the video' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
