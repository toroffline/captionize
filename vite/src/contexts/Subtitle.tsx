import { ComponentChildren } from 'preact';
import { createContext } from 'preact';
import { useCallback, useContext, useEffect, useState } from 'preact/hooks';
import axios, { AxiosResponse } from 'axios';

interface ContextValue {
  data?: ParagraphResponse;
  videoId?: string;
  toggleInsertSpeaker: boolean;
  onSaving?: boolean;
  currentRegionClicked?: number;
  setToggleInsertSpeaker: () => void;
  setActiveSpeaker: (
    paragraphIndex: number,
    contentIndex: number,
    speakerId: number | null
  ) => void;
  setCurrentRegionClicked: (paragraphIndex: number) => void;
  onSave: () => Promise<boolean>;
  onRemoveContent: (paragraphIndex: number, contentIndex: number) => void;
  onAddContent: (paragraphIndex: number) => void;
  onInputText: (
    paragraphIndex: number,
    contentIndex: number,
    text: string
  ) => void;
  updateParagraphTime: (
    index: number,
    from: ParagraphTimestampInfo,
    to: ParagraphTimestampInfo
  ) => void;
  exportData: () => void;
}

const initialValue: ContextValue = {
  data: undefined,
  videoId: undefined,
  toggleInsertSpeaker: true,
  onSaving: false,
  currentRegionClicked: undefined,
  setToggleInsertSpeaker: () => {},
  setActiveSpeaker: () => {},
  setCurrentRegionClicked: () => {},
  onSave: () => Promise.resolve(false),
  onRemoveContent: () => {},
  onAddContent: () => {},
  onInputText: () => {},
  updateParagraphTime: () => {},
  exportData: () => {},
};

const Context = createContext<ContextValue>(initialValue);
const useSubTitleManagementContext = () => useContext(Context);

const SubTitleManagementProvider = (props: {
  children?: ComponentChildren;
}) => {
  console.log('<SubTitleManagementProvider /> re-render');
  const [data, setData] = useState<ParagraphResponse | undefined>();
  const [videoId] = useState<string | undefined>('u0aWLBjBMgw');
  const [onSaving, setOnSaving] = useState<boolean>(false);
  const [toggleInsertSpeaker, setDummyToggleInsertSpeaker] =
    useState<boolean>(true);
  const [currentRegionClicked, setCurrentRegionClicked] = useState<
    number | undefined
  >();

  function setActiveSpeaker(
    paragraphIndex: number,
    contentIndex: number,
    speakerId: number | null
  ) {
    if (data) {
      setData((prev) => {
        if (prev) {
          prev.paragraphs[paragraphIndex].contents[contentIndex].speaker =
            speakerId;
        }

        return prev;
      });
    }
  }

  async function fetchData() {
    await axios
      .get('http://localhost:3000/api/paragraph')
      .then((response: AxiosResponse<ParagraphResponse>) => {
        setData(response.data);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  const exportData = useCallback(() => {
    console.log(data?.paragraphs);
  }, [data]);

  async function onSave() {
    console.log('saving');
    setOnSaving(true);
    const requestBody = { data: data?.paragraphs };

    return await axios
      .post(`http://localhost:3000/api/save`, requestBody)
      .then(() => {
        console.log('save successfully');
        return true;
      })
      .catch((error: any) => {
        console.error(error);
        return false;
      })
      .finally(() => setOnSaving(false));
  }

  function onRemoveContent(paragraphIndex: number, contentIndex: number) {
    setData((prev) => {
      if (prev) {
        prev.paragraphs[paragraphIndex].contents.splice(contentIndex, 1);
      }

      return prev;
    });
  }

  function onAddContent(paragraphIndex: number) {
    setData((prev) => {
      if (prev) {
        const newContent: ParagraphContent = {
          text: '',
          speaker: null,
        };
        prev.paragraphs[paragraphIndex].contents = [
          ...prev.paragraphs[paragraphIndex].contents,
          newContent,
        ];
      }

      return prev;
    });
  }

  function onInputText(
    paragraphIndex: number,
    contentIndex: number,
    text: string
  ) {
    setData((prev) => {
      if (prev) {
        prev.paragraphs[paragraphIndex].contents[contentIndex].text = text;
      }
      return prev;
    });
  }

  function updateParagraphTime(
    index: number,
    from: ParagraphTimestampInfo,
    to: ParagraphTimestampInfo
  ) {
    setData((prev) => {
      if (prev && prev.paragraphs) {
        prev.paragraphs[index].timestamp.from = from;
        prev.paragraphs[index].timestamp.to = to;
        prev.paragraphs = [...prev.paragraphs];
      }

      return prev;
    });
  }

  function setToggleInsertSpeaker() {
    setDummyToggleInsertSpeaker(!toggleInsertSpeaker);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Context.Provider
      value={{
        data,
        videoId,
        toggleInsertSpeaker,
        onSaving,
        currentRegionClicked,
        setToggleInsertSpeaker,
        setActiveSpeaker,
        setCurrentRegionClicked,
        exportData,
        onSave,
        onRemoveContent,
        onAddContent,
        onInputText,
        updateParagraphTime,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export { useSubTitleManagementContext, SubTitleManagementProvider };
