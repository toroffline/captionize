import { Fragment, h } from 'preact';
import { useSubTitleManagementContext } from '../contexts/Subtitle';
import { CommonUtil } from '../utils/common';
import { useCallback, useEffect, useState } from 'preact/hooks';

export const SubManagement = () => {
  const { data } = useSubTitleManagementContext();
  // const { paragraphs = [], speakers = [] } = data ?? {}
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

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

  const onClickSpeakerBtn = useCallback(
    (
      paragraphIndex: number,
      contentIndex: number,
      si: number,
      content: ParagraphContent
    ) => {
      const speakerId = content.speaker === si ? null : si;
      console.log(paragraphIndex, contentIndex, si, speakerId);
      setParagraphs((prev) => {
        prev.map((p, pi) => {
          if (pi === paragraphIndex) {
            const contents = [...p.contents];
            contents[contentIndex].speaker = speakerId;
            const clone = JSON.parse(JSON.stringify(p));
            clone.contents = contents;

            return clone;
          }

          return p;
        });

        return prev;
      });
    },
    []
  );

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
                  {p.contents.map((c: ParagraphContent, ci) => (
                    <TextManagement
                      key={`key-TextManagement-paragraph-${pi}-oldIndex-${p.oldIndex}-content-${ci}`}
                      paragraphIndex={pi}
                      contentIndex={ci}
                      content={c}
                      speakers={speakers}
                      onClickSpeakerBtn={onClickSpeakerBtn}
                    />
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const TextManagement = (props: {
  paragraphIndex: number;
  contentIndex: number;
  content: ParagraphContent;
  speakers: Speaker[];
  onClickSpeakerBtn: (
    pi: number,
    ci: number,
    si: number,
    content: ParagraphContent
  ) => void;
}) => {
  const { paragraphIndex, contentIndex, content, speakers, onClickSpeakerBtn } =
    props;

  function getSpeakerName(speakers: Speaker[], speakerId: number | null) {
    return speakerId !== null &&
      CommonUtil.isTruthlyIncludeZero(speakerId) &&
      speakers
      ? speakers[speakerId].name
      : '';
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
            value={content.content}
          />
        </div>
        <SpeakerBtnGroup
          paragraphIndex={paragraphIndex}
          contentIndex={contentIndex}
          speakers={speakers}
          content={content}
          onClickSpeakerBtn={onClickSpeakerBtn}
        />
      </div>
      <button
        key={`key-button-content-paragraph-${paragraphIndex}-content-${contentIndex}`}
        type="button"
        class="btn btn-outline-success"
      >
        ➕ Add
      </button>
    </Fragment>
  );
};

const SpeakerBtnGroup = (props: {
  paragraphIndex: number;
  contentIndex: number;
  speakers: Speaker[];
  content: ParagraphContent;
  onClickSpeakerBtn: (
    pi: number,
    ci: number,
    si: number,
    content: ParagraphContent
  ) => void;
}) => {
  const { paragraphIndex, contentIndex, speakers, content, onClickSpeakerBtn } =
    props;

  return (
    <>
      <div class="btn-group" role="group">
        {speakers.map((s, si) => (
          <button
            key={`key-btn-row-paragraph-${paragraphIndex}-content-${contentIndex}-speaker-${si}`}
            id={`btn-row-paragraph-${paragraphIndex}-content-${contentIndex}-speaker-${si}`}
            class={`btn btn-outline-info${
              content.speaker === si ? ' active' : ''
            }`}
            type="button"
            value="0"
            onClick={() =>
              onClickSpeakerBtn(paragraphIndex, contentIndex, si, content)
            }
          >
            {s.name}
          </button>
        ))}
      </div>
      <button type="button" class="ml-1 btn btn-outline-danger">
        🗑️ Remove
      </button>
    </>
  );
};
