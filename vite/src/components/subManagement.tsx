import { Fragment, h } from 'preact';
import { useSubTitleManagementContext } from '../contexts/subTitle';
import { CommonUtil } from '../utils/common';
import { useEffect, useMemo, useState } from 'preact/hooks';

export const SubManagement = () => {
  const { data } = useSubTitleManagementContext();
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  console.log('render parent');

  useEffect(() => {
    if (data && paragraphs.length === 0 && speakers.length === 0) {
      setParagraphs(data.paragraphs);
      setSpeakers(data.speakers);
    }
  }, [data]);

  function composeTimestamp(timestamp: ParagraphTimestampInfo) {
    const delimiter = ':';
    const f = CommonUtil.preZero;
    return `${f(timestamp.h)}${delimiter}${f(timestamp.m)}${delimiter}${f(
      timestamp.s
    )},${f(timestamp.ms)}`;
  }

  return (
    <div class="sub-manage-center text-center">
      <table id="table" class="table table-hover table-bordered">
        <thead class="freeze">
          <tr>
            <th rowSpan={2}>index</th>
            <th colSpan={2} class="col-timestamp">
              duration
            </th>
            <th rowSpan={2}>text</th>
            <th rowSpan={2}>translation</th>
          </tr>
          <tr>
            <th>from</th>
            <th>to</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          {paragraphs.map((p: Paragraph, pi: number) => {
            return (
              <tr key={`key-tr-paragraph-${pi}-oldIndex-${p.oldIndex}`}>
                <td>{pi}</td>
                <td>{composeTimestamp(p.timestamp.from)}</td>
                <td>{composeTimestamp(p.timestamp.to)}</td>
                <td>
                  <ContentsManagement
                    paragraphIndex={pi}
                    speakers={speakers}
                    contents={p.contents}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const ContentsManagement = (props: {
  paragraphIndex: number;
  contents: ParagraphContent[];
  speakers: Speaker[];
}) => {
  const { paragraphIndex, contents: _contents, speakers } = props;
  const { onRemoveContent, onAddContent, setActiveSpeaker, onInputText } =
    useSubTitleManagementContext();
  const [contents, setContents] = useState(_contents);
  console.log(`render content management ${paragraphIndex}`);

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
    setActiveSpeaker(paragraphIndex, contentIndex, speakerId);
    setContents((prev) => {
      prev[contentIndex].speaker = speakerId;
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
    <>
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
    </>
  );
};

const TextManagement = (props: {
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

  console.log(`render text management ${paragraphIndex} ${contentIndex}`);

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
      <div class="pb-3">
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
        <SpeakerBtnGroup
          key={`key-speaker-btn-group-${paragraphIndex}-${contentIndex}`}
          paragraphIndex={paragraphIndex}
          contentIndex={contentIndex}
          speakers={speakers}
          activeId={_content.speaker}
          handleClickSpeakerBtn={(si: number) => handleClickSpeakerBtn(si)}
        />
        <button
          type="button"
          class="ml-1 btn btn-outline-danger"
          onClick={() => handleClickRemoveContent()}
        >
          🗑️ Remove
        </button>
      </div>
    </Fragment>
  );
};

const SpeakerBtnGroup = (props: {
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

  console.log(`render speaker btn ${paragraphIndex} ${contentIndex}`);

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
