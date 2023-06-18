import { h } from 'preact';
import { useEffect, useMemo, useRef } from 'preact/hooks';
import { useSubTitleManagementContext } from '../contexts/subTitle';

interface Props {
  textPreview?: string;
}

export const Preview = (props: Props) => {
  const { textPreview } = props;
  const { videoId } = useSubTitleManagementContext();
  const textDisplay = useMemo(() => textPreview || '...', [textPreview]);
  const playerRef = useRef<any>(null); // YT.Player

  useEffect(() => {
    if (window.YT && window.YT.Player) {
      playerRef.current = new window.YT.Player('player', {
        height: '360',
        width: '640',
        videoId,
      });
    }
  }, []);

  return (
    <div class="preview">
      <div class="scene">
        <div id="text-preview" class="text-preview">
          {textDisplay}
        </div>
        <div id="player" ref={playerRef}></div>
      </div>
    </div>
  );
};
