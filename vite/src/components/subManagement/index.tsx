import { Fragment, h } from 'preact';
import { useSubTitleManagementContext } from '../../contexts/subTitle';
import { useEffect, useState } from 'preact/hooks';
import { ParagraphContainer } from './paragraphContainer';

export const SubManagement = () => {
  const { data, currentRegionClicked } = useSubTitleManagementContext();
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  useEffect(() => {
    const element = document.getElementById(
      `paragraph-container-${currentRegionClicked}`
    );
    if (element) {
      element.scrollIntoView();
    }
  }, [currentRegionClicked]);

  useEffect(() => {
    if (data && paragraphs.length === 0 && speakers.length === 0) {
      setParagraphs(data.paragraphs);
      setSpeakers(data.speakers);
    }
  }, [data]);

  return (
    <div class="sub-manage-center">
      {paragraphs.map((p: Paragraph, pi: number) => {
        return (
          <>
            <ParagraphContainer
              index={pi}
              paragraphIndex={pi}
              paragraph={p}
              speakers={speakers}
              focus={currentRegionClicked === pi}
            />
            <hr class="mt-0" />
          </>
        );
      })}
    </div>
  );
};
