import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';
import {
  buildExportFileContent,
  getParagraphs,
  getSpeakers,
  saveResult,
} from '../index.js';
import getYoutubeAudio from './apis/youtube-audio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 3000;

const app = express();

// Middleware to parse request body
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message || 'Internal Server Error',
    },
  });
});

app.get('/', (_req, res) => {
  res.send('Hello world');
});

app.get('/api/paragraph', (_req, res) => {
  const fileName = 'caption.th_TH (3)';
  const paragraphs = getParagraphs(fileName);
  const speakers = getSpeakers(fileName);
  res.send({ paragraphs, speakers });
});

app.post('/api/save', (req, res) => {
  console.debug('req:', req.body.data.length);
  const fileName = 'caption.th_TH (3)';
  saveResult(fileName, req.body.data);
  res.send({ success: true });
});

app.get('/api/youtube/audio', (req, res) => {
  const videoId = req.query.videoId;
  if (videoId) {
    console.log('videoID:', videoId);
    const audio = getYoutubeAudio(videoId, __dirname, res);
    res.setHeader('Content-Type', 'audio/m4a');
    res.setHeader('Content-Disposition', 'attachment; filename=audio.m4a');
    res.send(audio);
  } else {
    const error = new Error('Required videoId');
    error.status = 404;

    res.status(error.status).json({
      error: {
        message: error.message,
      },
    });
  }
});

app.post('/api/export', (req, res) => {
  console.debug('req:', req.body.data.length);
  const fileContent = buildExportFileContent(req.body.data);
  const fileName = 'result.srt';

  fs.writeFile(fileName, fileContent, (err) => {
    if (err) {
      console.error('Error building file:', err);
      res.status(500).send('Error building file');
    } else {
      // Send the file as a response
      res.setHeader('Content-Disposition', `filename="${fileName}"`);
      res.download(fileName, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).send('Error sending file');
        } else {
          // Cleanup: Delete the file after it has been sent
          fs.unlink(fileName, (err) => {
            if (err) {
              console.error('Error deleting file:', err);
            }
          });
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

console.log('Starting backend...');
