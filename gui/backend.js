import express from "express";
import path from "path";
import bodyParser from "body-parser";
import fs from "fs";
import cors from 'cors';
import { fileURLToPath } from "url";
import {
  buildExportFileContent,
  getParagraphs,
  getSpeakers,
} from "../index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 3000;

const app = express();

// Middleware to parse request body
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (_req, res) => {
  res.send("Hello world");
});

app.get("/api/paragraph", (_req, res) => {
  const fileName = "caption.th_TH (3)";
  const paragraphs = getParagraphs(fileName);
  const speakers = getSpeakers(fileName);
  res.send({ paragraphs, speakers });
});

app.post("/api/export", (req, res) => {
  console.debug("req:", req.body.data.length);
  const fileContent = buildExportFileContent(req.body.data);
  const fileName = "result.srt";

  fs.writeFile(fileName, fileContent, (err) => {
    if (err) {
      console.error("Error building file:", err);
      res.status(500).send("Error building file");
    } else {
      // Send the file as a response
      res.setHeader(
        "Content-Disposition",
        `filename="${fileName}"`
      );
      res.download(fileName, (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).send("Error sending file");
        } else {
          // Cleanup: Delete the file after it has been sent
          fs.unlink(fileName, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
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

console.log("Starting backend...");
