interface ParagraphTimestampInfo {
  h: number;
  m: number;
  s: number;
  ms: number;
}

interface ParagraphTimestamp {
  from: ParagraphTimestampInfo;
  to: ParagraphTimestampInfo;
}

interface ParagraphContent {
  text: string;
  speaker: number | null;
}

interface Paragraph {
  oldIndex: number;
  timestamp: ParagraphTimestamp;
  timestampDisplay: string;
  contents: ParagraphContent[];
}

interface Speaker {
  name: string;
  count: number;
}

interface ParagraphResponse {
  paragraphs: Paragraph[];
  speakers: Speaker[];
}
