import { ComponentChildren } from 'preact'
import { createContext } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import axios, { AxiosResponse } from 'axios'

interface ContextValue {
  data?: ParagraphResponse
  setContent: (
    paragraphIndex: number,
    contentIndex: number,
    speakerId: number
  ) => void
}

const initialValue: ContextValue = {
  data: undefined,
  setContent: () => {},
}

const Context = createContext<ContextValue>(initialValue)
const useSubTitleManagementContext = () => useContext(Context)

const SubTitleManagementProvider = (props: {
  children?: ComponentChildren
}) => {
  const [data, setData] = useState<ParagraphResponse | undefined>()

  function setContent(
    paragraphIndex: number,
    contentIndex: number,
    speakerId: number
  ) {
    if (data) {
      const temp = JSON.parse(JSON.stringify(data))
      temp.paragraphs[paragraphIndex].contents[contentIndex].speaker = speakerId
      setData(temp)
    }
  }

  async function fetchData() {
    await axios
      .get('http://localhost:3000/api/paragraph')
      .then((response: AxiosResponse<ParagraphResponse>) => {
        setData(response.data)
      })
      .catch((error: any) => {
        console.error(error)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Context.Provider value={{ data, setContent }} children={props.children} />
  )
}

export { useSubTitleManagementContext, SubTitleManagementProvider }
