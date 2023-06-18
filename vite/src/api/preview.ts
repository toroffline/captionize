import axios from 'axios';

const URL = `http://localhost:3000/api`;

export namespace PreviewService {
  export async function getYoutubeAudio(videoId: string) {
    const path = `${URL}/youtube/audio?${new URLSearchParams({ videoId })}`;
    try {
      const response = await axios.get(path, { responseType: 'blob' });

      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
