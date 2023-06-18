import { spawn, exec } from 'child_process';
import path from 'path';
import { transferChildProcessOutput } from '../utils/shell.js';
import fs from 'fs';
import { toArrayBuffer } from '../utils/common.js';

export default function getYoutubeAudio(videoId, __dirname, res) {
  const path = `./data/audio/${videoId}.m4a`;
  const file = fs.readFileSync(path);
  return file;
  // const fileStream = fs.createReadStream(path);
  // fileStream.pipe(res);
}

function temp() {
  // const cmd = spawn(
  //   path.join(process.cwd(), 'scripts/youtube-audio-download.sh'),
  //   [videoId || '']
  // );

  // const path = `${__dirname.replace(/\\/g, '/')}/youtube-audio-download.sh`;
  const path = `./scripts/youtube-audio-download.sh`;
  console.log({ path });

  exec(`cd `, (error, stdout, stderr) => {
    // exec(`bash ${path} ${videoId}`, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      console.error(`Error executing the script: ${error.message}`);
      return;
    }

    console.log('Script executed successfully');

    if (stdout) {
      console.log(`Script output:\n${stdout}`);
    }

    if (stderr) {
      console.error(`Script error:\n${stderr}`);
    }
  });

  // transferChildProcessOutput(cmd, res);
}
