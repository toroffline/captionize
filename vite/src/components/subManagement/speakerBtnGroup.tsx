import { h } from 'preact';
import { useMemo } from 'preact/hooks';

export const SpeakerBtnGroup = (props: {
  paragraphIndex: number;
  contentIndex: number;
  activeId: number | null;
  speakers: Speaker[];
  handleClickSpeakerBtn: (speakerId: number) => void;
}) => {
  const {
    paragraphIndex,
    contentIndex,
    speakers,
    activeId,
    handleClickSpeakerBtn,
  } = props;
  const _activeId = useMemo(() => activeId, [activeId]);

  return (
    <>
      <div class="btn-group" role="group">
        {speakers.map((s, si) => (
          <button
            key={`key-btn-row-paragraph-${paragraphIndex}-content-${contentIndex}-speaker-${si}`}
            id={`btn-row-paragraph-${paragraphIndex}-content-${contentIndex}-speaker-${si}`}
            class={`btn btn-outline-info${_activeId === si ? ' active' : ''}`}
            type="button"
            value="0"
            onClick={() => {
              handleClickSpeakerBtn(si);
            }}
          >
            {s.name}
          </button>
        ))}
      </div>
    </>
  );
};
