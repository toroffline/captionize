import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import WaveSurfer from 'wavesurfer.js';
import { PreviewService } from '../api/preview';
import { useSubTitleManagementContext } from '../contexts/subTitle';

export const Wave = () => {
  const { videoId } = useSubTitleManagementContext();
  const waveSurferRef = useRef(null);

  useEffect(() => {
    let waveSurfer: any;
    if (waveSurferRef && waveSurferRef.current && videoId) {
      const waveSurfer = WaveSurfer.create({
        container: '#wave-form',
        waveColor: '#4F4A85',
        progressColor: '#383351',
        barWidth: 2,
        barGap: 2,
        barRadius: 1,
        autoCenter: true,
        responsive: true,
      });

      waveSurfer.on('ready', () => {
        waveSurfer.pause();
      });

      // waveSurfer.on('interaction', (e) => {
      //   console.log(e);
      //   if (waveSurfer.isPlaying()) {
      //     waveSurfer.setDisabledEventEmissions(['interaction']);
      //     waveSurfer.pause();
      //     waveSurfer.setDisabledEventEmissions([]);
      //   } else {
      //     waveSurfer.setDisabledEventEmissions(['interaction']);
      //     waveSurfer.play();
      //     waveSurfer.setDisabledEventEmissions([]);
      //   }
      // });

      const loadAudio = async () => {
        try {
          const audioResponse = await PreviewService.getYoutubeAudio(videoId);
          const audioBlob = new Blob([audioResponse], { type: 'audio/m4a' });

          console.log('audio loaded');
          waveSurfer.loadBlob(audioBlob);
        } catch (error) {
          console.error(error);
        }
      };

      loadAudio();
    }

    return () => {
      waveSurfer && waveSurfer.destroy();
    };
  }, [videoId]);
  return (
    <div class="footer">
      <div id="wave-form" class="wave-form" ref={waveSurferRef} />
    </div>
  );
};
