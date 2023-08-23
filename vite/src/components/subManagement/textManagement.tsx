import { Fragment, h } from 'preact';
import { useMemo } from 'preact/hooks';
import { CommonUtil } from '../../utils/common';
import { SpeakerBtnGroup } from './speakerBtnGroup';

export const TextManagement = (props: {
  paragraphIndex: number;
  contentIndex: number;
  content: ParagraphContent;
  speakers: Speaker[];
  onRemoveContent: (paragraphIndex: number, contentIndex: number) => void;
  handleClickSpeakerBtn: (speakerId: number) => void;
  handleInputText: (text: string) => void;
}) => {
  const {
    paragraphIndex,
    contentIndex,
    content: _content,
    speakers,
    onRemoveContent,
    handleClickSpeakerBtn,
    handleInputText,
  } = props;

  const content = useMemo(() => _content, [_content]);

  function getSpeakerName(speakers: Speaker[], speakerId: number | null) {
    return speakerId !== null &&
      CommonUtil.isTruthlyIncludeZero(speakerId) &&
      speakers
      ? speakers[speakerId].name
      : '';
  }

  function handleClickRemoveContent() {
    onRemoveContent(paragraphIndex, contentIndex);
  }

  return (
    <Fragment key={`key-Fragment-${paragraphIndex}-${contentIndex}`}>
      <div class="input-group mb-3">
        <span
          class="input-group-text"
          id={`text-speaker-paragraph-${paragraphIndex}`}
        >
          {getSpeakerName(speakers, content.speaker)}
        </span>
        <input
          key={`key-input-content-paragraph-${paragraphIndex}-content-${contentIndex}`}
          id={`input-content-paragraph-${paragraphIndex}-content-${contentIndex}`}
          class="form-control"
          value={content.text}
          onChange={(e) => handleInputText(e.currentTarget.value)}
        />
      </div>
      {/* <span class={`${toggleInsertSpeaker ? '' : 'd-none'} pb-3`}>
        <SpeakerBtnGroup
          key={`key-speaker-btn-group-${paragraphIndex}-${contentIndex}`}
          paragraphIndex={paragraphIndex}
          contentIndex={contentIndex}
          speakers={speakers}
          activeId={_content.speaker}
          handleClickSpeakerBtn={(si: number) => handleClickSpeakerBtn(si)}
        />
      </span>
      <button
        class={`btn btn-outline-secondary ml-3${
          toggleInsertSpeaker ? '' : ' d-none'
        }`}
        type="button"
        onClick={() => handleClickRemoveContent()}
      >
        ✖️
      </button> */}
    </Fragment>
  );
};
