import { ComponentChildren } from 'preact';
import { createContext } from 'preact';
import { useCallback, useContext, useEffect, useState } from 'preact/hooks';
import axios, { AxiosResponse } from 'axios';

interface ContextValue {
  data?: ParagraphResponse;
  setActiveSpeaker: (
    paragraphIndex: number,
    contentIndex: number,
    speakerId: number
  ) => void;
  exportData: () => void;
  onSave: () => void;
  onRemoveContent: (paragraphIndex: number, contentIndex: number) => void;
  onAddContent: (paragraphIndex: number) => void;
  onInputText: (
    paragraphIndex: number,
    contentIndex: number,
    text: string
  ) => void;
}

const initialValue: ContextValue = {
  data: undefined,
  setActiveSpeaker: () => {},
  exportData: () => {},
  onSave: () => {},
  onRemoveContent: () => {},
  onAddContent: () => {},
  onInputText: () => {},
};

const Context = createContext<ContextValue>(initialValue);
const useSubTitleManagementContext = () => useContext(Context);

const SubTitleManagementProvider = (props: {
  children?: ComponentChildren;
}) => {
  const [data, setData] = useState<ParagraphResponse | undefined>();

  function setActiveSpeaker(
    paragraphIndex: number,
    contentIndex: number,
    speakerId: number
  ) {
    if (data) {
      console.log({ paragraphIndex, contentIndex, speakerId });
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
    const requestBody = { data: data?.paragraphs };
    await axios
      .post(`http://localhost:3000/api/save`, requestBody)
      .then(() => {
        console.log('save successfully');
      })
      .catch((error: any) => {
        console.error(error);
      });
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Context.Provider
      value={{
        data,
        setActiveSpeaker,
        exportData,
        onSave,
        onRemoveContent,
        onAddContent,
        onInputText,
      }}
      children={props.children}
    />
  );
};

export { useSubTitleManagementContext, SubTitleManagementProvider };
