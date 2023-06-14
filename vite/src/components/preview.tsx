import { h } from 'preact';
import { useCallback, useEffect, useMemo, useRef } from 'preact/hooks';
import { useSubTitleManagementContext } from '../contexts/subTitle';

interface Props {
  textPreview?: string;
}

export const Preview = (props: Props) => {
  const { textPreview } = props;
  const { exportData, onSave } = useSubTitleManagementContext();
  const textDisplay = useMemo(() => textPreview || '...', [textPreview]);
  // YT.Player | null
  const playerRef = useRef<any>(null);

  const videoId = 'u0aWLBjBMgw';

  useEffect(() => {
    if (window.YT && window.YT.Player) {
      playerRef.current = new window.YT.Player('player', {
        height: '360',
        width: '640',
        videoId,
      });
    }
  }, []);

  function convertDurationToSeconds(h: number, m: number, s: number) {
    let seconds = 0;
    if (h) {
      seconds += h * 3600;
    }
    if (m) {
      seconds += m * 60;
    }
    if (s) {
      seconds += s;
    }

    return seconds;
  }

  function handleSave() {
    onSave();
  }

  function handleExport() {
    exportData();
  }

  return (
    <div class="preview sticky-top">
      <button
        id="btn-save"
        class="btn btn-success"
        onClick={() => handleSave()}
      >
        Save
      </button>
      <button
        id="btn-export"
        class="btn btn-primary"
        onClick={() => handleExport()}
      >
        Export
      </button>
      <div class="scene">
        <div id="text-preview" class="text-preview">
          {textDisplay}
        </div>
        <div id="player" ref={playerRef}></div>
      </div>
    </div>
  );
};
