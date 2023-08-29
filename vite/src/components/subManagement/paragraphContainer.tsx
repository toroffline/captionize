import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { CommonUtil } from '../../utils/common';
import { Button, Overlay, Popover, PopoverBody } from 'react-bootstrap';
import { ContentsManagement } from './contentsManagement';
import { useSubTitleManagementContext } from '../../contexts/subTitle';

export const ParagraphContainer = (props: {
  index: number;
  paragraphIndex: number;
  paragraph: Paragraph;
  speakers: Speaker[];
  focus?: boolean;
}) => {
  const { setCurrentRegionClicked } = useSubTitleManagementContext();
  const { index, paragraphIndex, paragraph, speakers, focus } = props;
  const [showActions, setShowActions] = useState(false);
  const [focusParagraph, setFocusParagraph] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setFocusParagraph(!!focus);
  }, [focus]);

  function composeTimestamp(timestamp: ParagraphTimestampInfo) {
    const delimiter = ':';
    const f = CommonUtil.preZero;

    return `${f(timestamp.h)}${delimiter}${f(timestamp.m)}${delimiter}${f(
      timestamp.s
    )},${f(timestamp.ms)}`;
  }

  function handleRightClick(e: Event) {
    e.preventDefault();
    setShowActions(true);
  }

  function handleExitActions() {
    setShowActions(false);
  }

  function handleMouseFocus() {
    if (!focusParagraph) {
      setFocusParagraph(true);
    }
  }

  function handleMouseLeave() {
    if (focusParagraph) {
      setFocusParagraph(false);
    }
  }

  function handleClickParagraph() {
    setCurrentRegionClicked(index);
  }

  return (
    <div
      id={`paragraph-container-${index}`}
      onClick={() => handleClickParagraph()}
    >
      <Overlay
        target={containerRef.current}
        show={showActions}
        placement="left-start"
        rootCloseEvent="mousedown"
        rootClose={true}
        onHide={() => handleExitActions()}
      >
        <Popover>
          <PopoverBody>
            <Button variant="secondary">Remove ❌</Button>
          </PopoverBody>
        </Popover>
      </Overlay>
      <div
        class={`paragraph-container${focusParagraph ? ' focus-paragraph' : ''}`}
        onContextMenu={(e) => handleRightClick(e)}
        ref={containerRef}
        onMouseEnter={() => handleMouseFocus()}
        onMouseLeave={() => handleMouseLeave()}
      >
        <div class="small text-muted mr-1">{paragraphIndex + 1}</div>
        <div class="timeline">
          <div class="small text-muted">
            {composeTimestamp(paragraph.timestamp.from)}
          </div>
          <div class="small text-muted">
            {composeTimestamp(paragraph.timestamp.to)}
          </div>
        </div>
        <ContentsManagement
          paragraphIndex={paragraphIndex}
          speakers={speakers}
          contents={paragraph.contents}
        />
      </div>
    </div>
  );
};
