interface ParagraphTimestampInfo {
  h: number
  m: number
  s: number
  ms: number
}

interface ParagraphTimestamp {
  from: ParagraphTimestampInfo
  to: ParagraphTimestampInfo
}

interface ParagraphContent {
  content: string
  speaker: number | null
}

interface Paragraph {
  oldIndex: number
  timestamp: ParagraphTimestamp
  timeStampDisplay: string
  contents: ParagraphContent[]
}

interface Speaker {
  name: string
  count: number
}

interface ParagraphResponse {
  paragraphs: Paragraph[]
  speakers: Speaker[]
}
