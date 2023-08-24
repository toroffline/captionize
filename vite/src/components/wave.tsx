import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { PreviewService } from '../api/preview';
import { useSubTitleManagementContext } from '../contexts/subTitle';
import { CommonUtil } from '../utils/common';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions';

export const Wave = () => {
  const { videoId, data } = useSubTitleManagementContext();
  const waveSurferRef = useRef(null);
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer>();

  useEffect(() => {
    if (waveSurferRef && waveSurferRef.current && videoId) {
      const wsBottomTimeline = TimelinePlugin.create({
        height: 25,
        style: {
          fontSize: '20px',
          color: '#6A3274',
        },
      });

      const ws = WaveSurfer.create({
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
        plugins: [wsBottomTimeline],
      });
      setWaveSurfer(ws);

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
          ws.loadBlob(audioBlob);
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

  useEffect(() => {
    if (waveSurfer && data) {
      waveSurfer.on('ready', () => {
        waveSurfer.zoom(90);
        waveSurfer.pause();

        const wsRegions = RegionsPlugin.create();
        waveSurfer.registerPlugin(wsRegions);

        data.paragraphs.forEach((paragraph) => {
          const start = paragraph.timestamp.from;
          const end = paragraph.timestamp.to;
          let text = '';
          paragraph.contents.forEach((content, index) => {
            if (index > 0) {
              text += '\n\r';
            }
            text += content.text;
          });
          const startSec = CommonUtil.convertDurationToSeconds(
            start.h,
            start.m,
            start.s,
            start.ms
          );
          const endSec = CommonUtil.convertDurationToSeconds(
            end.h,
            end.m,
            end.s,
            end.ms
          );
          wsRegions.addRegion({
            id: `region-1`,
            start: startSec,
            end: endSec,
            content: text,
            color: `rgba(255, 255, 255, 0.8)`,
            drag: true,
            resize: true,
          });
        });
      });
    }
    if (data) {
      data.paragraphs;
    }
  }, [waveSurfer, data]);

  return (
    <div class="footer">
      <div id="wave-form" class="wave-form" ref={waveSurferRef}></div>
    </div>
  );
};
