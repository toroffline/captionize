import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline';
import { PreviewService } from '../api/preview';
import { useSubTitleManagementContext } from '../contexts/subTitle';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions';
import { CommonUtil } from '../utils/common';

export const Wave = () => {
  const { videoId } = useSubTitleManagementContext();
  const waveSurferRef = useRef(null);

  useEffect(() => {
    let waveSurfer: any;
    if (waveSurferRef && waveSurferRef.current && videoId) {
      const wsBottomTimeline = TimelinePlugin.create({
        height: 25,
        style: {
          fontSize: '20px',
          color: '#6A3274',
        },
      });

      const wsRegions = RegionsPlugin.create();

      const waveSurfer = WaveSurfer.create({
        container: '#wave-form',
        waveColor: '#4F4A85',
        progressColor: '#383351',
        barWidth: 2,
        barGap: 2,
        barRadius: 1,
        autoCenter: true,
        height: 100,
        minPxPerSec: 1,
        autoScroll: true,
        plugins: [wsBottomTimeline, wsRegions],
      });

      waveSurfer.on('ready', () => {
        waveSurfer.zoom(90);
        waveSurfer.pause();

        wsRegions.addRegion({
          start: 0,
          end: 2,
          content: 'Resize me',
          color: CommonUtil.randomColor(),
          drag: true,
          resize: true,
        });
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
      <div id="wave-form" class="wave-form" ref={waveSurferRef}></div>
    </div>
  );
};
