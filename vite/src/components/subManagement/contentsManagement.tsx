import { h } from 'preact';
import { useSubTitleManagementContext } from '../../contexts/subTitle';
import { useEffect, useState } from 'preact/hooks';
import { TextManagement } from './textManagement';

export const ContentsManagement = (props: {
  paragraphIndex: number;
  contents: ParagraphContent[];
  speakers: Speaker[];
}) => {
  const { paragraphIndex, contents: _contents, speakers } = props;
  const {
    toggleInsertSpeaker,
    onRemoveContent,
    onAddContent,
    setActiveSpeaker,
    onInputText,
  } = useSubTitleManagementContext();
  const [contents, setContents] = useState([..._contents]);

  useEffect(() => {
    if (contents != _contents) {
      setContents([..._contents]);
    }
  }, [_contents]);

  function handleRemoveContent(contentIndex: number) {
    onRemoveContent(paragraphIndex, contentIndex);
    setContents((prev) => {
      prev.splice(contentIndex, 1);
      return [...prev];
    });
  }

  function handleAddContent() {
    setContents((prev) => {
      const newContent: ParagraphContent = {
        text: '',
        speaker: null,
      };
      prev = [...prev, newContent];
      return prev;
    });
    onAddContent(paragraphIndex);
  }

  function handleClickSpeakerBtn(contentIndex: number, speakerId: number) {
    let _speakerId: number | null = speakerId;
    if (contents[contentIndex].speaker === speakerId) {
      _speakerId = null;
    }
    setActiveSpeaker(paragraphIndex, contentIndex, _speakerId);
    setContents((prev) => {
      prev[contentIndex].speaker = _speakerId;
      return [...prev];
    });
  }

  function handleInputText(contentIndex: number, text: string) {
    setContents((prev) => {
      prev[contentIndex].text = text;
      return [...prev];
    });
    onInputText(paragraphIndex, contentIndex, text);
  }

  return (
    <div class="content mb-4">
      {contents.map((c, ci) => (
        <TextManagement
          key={`key-TextManagement-paragraph-${paragraphIndex}-content-${ci}`}
          paragraphIndex={paragraphIndex}
          contentIndex={ci}
          content={c}
          speakers={speakers}
          onRemoveContent={() => handleRemoveContent(ci)}
          handleClickSpeakerBtn={(si: number) => handleClickSpeakerBtn(ci, si)}
          handleInputText={(text: string) => handleInputText(ci, text)}
          toggleInsertSpeaker={toggleInsertSpeaker}
        />
      ))}
      <button
        key={`key-button-content-paragraph-${paragraphIndex}`}
        type="button"
        class="btn btn-outline-success"
        onClick={handleAddContent}
      >
        ➕ Add
      </button>
    </div>
  );
};
