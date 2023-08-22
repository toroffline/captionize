import { Fragment, h } from 'preact';
import { useSubTitleManagementContext } from '../../contexts/subTitle';
import { useEffect, useState } from 'preact/hooks';
import { ParagraphContainer } from './paragraphContainer';

export const SubManagement = () => {
  const { data } = useSubTitleManagementContext();
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

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
              paragraphIndex={pi}
              paragraph={p}
              speakers={speakers}
            />
            <hr class="mt-0" />
          </>
        );
      })}
    </div>
  );
};
