import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { getParagraphs, getSpeakers } from "../index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 3000;

const app = express();

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();

  next();
});

// app.use(express.static('public'));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/data", (_req, res) => {
  const fileName = "caption.th_TH (3)";
  const paragraphs = getParagraphs(fileName);
  const speakers = getSpeakers(fileName);
  res.send({ paragraphs, speakers });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

function onInit() {
}

console.log("Starting backend...");
