import fs from 'fs';
import inquirer from 'inquirer';
import Table from 'cli-table';
import colors from 'colors';

const patternSpeaker = '[{name}]';
const TABLE_CONFIG = {
  head: ['index', 'oldIndex', 'timestamp', 'content_1', 'content_2'],
  colWidths: [10, 10, 32, 50, 50],
};
const PAGINATION = {
  pageSize: 10,
};

function compareTimestamp(t1, t2) {
  if (t1.h > t2.h) {
    return -1;
  } else if (t1.h < t2.h) {
    return 1;
  }
  if (t1.m > t2.m) {
    return -1;
  } else if (t1.m < t2.m) {
    return 1;
  }
  if (t1.s > t2.s) {
    return -1;
  } else if (t1.s < t2.s) {
    return 1;
  }
  if (t1.ms > t2.ms) {
    return -1;
  } else if (t1.ms < t2.ms) {
    return 1;
  }
}

function collectData(fileName) {
  const chars = fs.readFileSync(`./data/${fileName}`, 'utf-8');
  let paragraphs = [];
  let oldIndex = 1;
  let lineCount = 0;
  let timestampDisplay = '';
  let contents = [];
  let content = '';
  const timestampRegex = /(\d+):(\d+):(\d+),(\d+) --> (\d+):(\d+):(\d+),(\d+)/;

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    if (
      char === '\n' &&
      chars[i - 1] === '\n'
      // || (char === "\n" && chars[i - 2] === "\n")
    ) {
      const matched = timestampDisplay.match(timestampRegex);
      console.log({ matched, contents, timestampDisplay });
      const timestamp = {
        from: {
          h: +matched[1],
          m: +matched[2],
          s: +matched[3],
          ms: +matched[4],
        },
        to: {
          h: +matched[5],
          m: +matched[6],
          s: +matched[7],
          ms: +matched[8],
        },
      };
      const paragraph = {
        oldIndex,
        timestamp,
        timestampDisplay: timestampDisplay.replace('\r', ''),
        contents,
      };
      paragraphs.push(paragraph);
      oldIndex += 1;
      lineCount = 0;
      timestampDisplay = '';
      contents = [];
      continue;
    }
    if (char !== '\n') {
      if (lineCount == 1) {
        timestampDisplay += char;
      } else if (lineCount >= 2) {
        content += char;
      }
    } else {
      if (lineCount >= 2) {
        contents.push({
          text: content.replace('\r', ''),
          speaker: null,
        });
        content = '';
      }
      lineCount += 1;
    }
  }

  return paragraphs;
}

export function buildExportFileContent(paragraphs, speakers) {
  if (!speakers) {
    speakers = getSpeakers('caption.th_TH (3)');
  }

  let result = '';
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    result += `${i + 1}\n`;
    result += `${paragraph.timestampDisplay}\n`;
    for (let j = 0; j < paragraph.contents.length; j++) {
      const content = paragraph.contents[j];
      result += displaySpeaker(content.speaker, speakers, content.content);
      result += '\n';
    }

    result += '\n';
  }

  return result;
}

function exportResultAsFile(paragraphs, fileName) {
  const fileContent = buildExportFileContent(paragraphs);
  const resultFileName = `${fileName}-result.txt`;
  try {
    fs.writeFileSync(`./data/${resultFileName}`, result);
    logInfo('>> Successfully exported 🚀');
  } catch (ex) {
    console.error(ex);
    logInfo('>> Export failed 💀');
  }
}

export function getSpeakers(fileName) {
  let speakers = [];
  try {
    const chars = fs.readFileSync(
      `./data/${fileName}-speaker_obj.txt`,
      'utf-8'
    );
    speakers = JSON.parse(chars);
  } catch (ex) {
    try {
      const chars = fs.readFileSync(`./data/${fileName}-speaker.txt`, 'utf-8');
      let speaker = '';
      for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        if (char === '\n') {
          speakers.push({ name: speaker, count: 0 });
          speaker = '';
          continue;
        } else if (char === '\r') {
          continue;
        }
        speaker += char;
      }
      fs.writeFileSync(
        `./data/${fileName}-speaker_obj.txt`,
        JSON.stringify(speakers)
      );
    } catch (ex) {
      console.error(ex);
    }
  }

  return speakers;
}

function displaySpeaker(speaker, speakers, content) {
  return isTruthyExceptZero(speaker)
    ? `${patternSpeaker.replace('{name}', speakers[speaker].name)} ${content}`
    : content;
}

function boldText(str) {
  return colors.bold(str);
}

function renderRangeTable(index, paragraphs, speakers, tableConfig) {
  let table = new Table(tableConfig);
  const PADDING = 5;
  const displayParagraph = paginate(
    paragraphs,
    PAGINATION.pageSize,
    undefined,
    index - PADDING,
    index + PADDING
  );
  const tempIndex = paragraphs[index].oldIndex;

  displayParagraph.forEach((p, i) => {
    const matchedIndex = p.oldIndex === tempIndex;
    let oldIndex = p.oldIndex,
      timestamp = p.timestampDisplay,
      content_1 = displaySpeaker(p.speaker_1, speakers, p.content_1),
      content_2 = displaySpeaker(p.speaker_2, speakers, p.content_2),
      displayIndex = index - (PADDING - i);
    if (displayIndex < 0) {
      displayIndex += PADDING;
    }
    if (matchedIndex) {
      displayIndex = boldText(displayIndex);
      oldIndex = boldText(oldIndex);
      timestamp = boldText(timestamp);
      content_1 = boldText(content_1);
      content_2 = boldText(content_2);
    }
    table.push([displayIndex, oldIndex, timestamp, content_1, content_2]);
  });
  console.log(table.toString());
}

async function askWhoSpeaker(index, paragraphs, speakers) {
  let _TABLE_CONFIG = {
    ...TABLE_CONFIG,
    head: [
      'index',
      'oldIndex',
      'timestamp',
      colors.bgWhite('content_1'),
      'content_2',
    ],
  };
  renderRangeTable(index, paragraphs, speakers, _TABLE_CONFIG);
  /* Unable to display count correctly */
  // const choices = speakers.map((s, si) => ({ value: si, name: `${s.name} (${s.count})` }));
  const choices = speakers.map((s, si) => ({ value: si, name: `${s.name}` }));
  choices.unshift({
    name: '[blank]',
    value: '',
  });
  choices.push({
    name: 'Exit',
    value: 'exit',
  });

  let speaker_1 = '',
    speaker_2 = '';
  speaker_1 = await inquirer
    .prompt([
      {
        type: 'rawlist',
        name: 'speaker_1',
        message: 'speaker of `content_1`',
        choices,
      },
    ])
    .then(({ speaker_1 }) => speaker_1);
  if (speaker_1 === 'exit') {
    return {
      speaker_1,
      speaker_2,
    };
  }
  const paragraph = paragraphs[index];
  paragraph.speaker_1 = speaker_1;

  let content_2 = paragraph.content_2;
  if (content_2) {
    _TABLE_CONFIG = {
      ..._TABLE_CONFIG,
      head: [
        'index',
        'oldIndex',
        'timestamp',
        'content_1',
        colors.bgWhite('content_2'),
      ],
    };
    console.clear();
    renderRangeTable(index, paragraphs, speakers, _TABLE_CONFIG);

    speaker_2 = await inquirer
      .prompt([
        {
          type: 'rawlist',
          name: 'speaker_2',
          message: 'speaker of `content_2`',
          choices,
        },
      ])
      .then(({ speaker_2 }) => speaker_2);
  }

  return {
    speaker_1,
    speaker_2,
  };
}

function paginate(array, pageSize, pageNumber, startIndex, endIndex) {
  startIndex = startIndex <= 0 ? 0 : startIndex;
  endIndex = endIndex >= array.length - 1 ? array.length - 1 : endIndex;
  return array.slice(
    startIndex || (pageNumber - 1) * pageSize,
    endIndex || pageNumber * pageSize
  );
}

function isTruthyExceptZero(value) {
  return value === 0 || !!value;
}

async function renderTable(paragraphs, speakers) {
  const _choices = {
    next: 'next',
    back: 'back',
    jumpToIndex: 'jumpToIndex',
    jumpToLatestUntagged: 'jumpToLatestUntagged',
    exit: 'exit',
  };
  let page = 1;
  let pageSize = PAGINATION.pageSize;
  while (1) {
    const choices = [
      {
        value: _choices.jumpToLatestUntagged,
        name: 'Jump to latest untag',
      },
      {
        value: _choices.jumpToIndex,
        name: 'Jump to index',
      },
      {
        value: _choices.exit,
        name: 'Exit',
      },
    ];
    if (page - 1 > 0) {
      choices.unshift({
        value: _choices.back,
        name: 'Back',
      });
    }
    if (page * pageSize < paragraphs.length) {
      choices.unshift({
        value: _choices.next,
        name: 'Next',
      });
    }
    console.clear();
    const table = new Table(TABLE_CONFIG);
    const paginated = paginate(paragraphs, pageSize, page);
    for (let i = 0; i < paginated.length; i++) {
      const p = paginated[i];
      let index = (page - 1) * pageSize + i;
      index = p.isTagComplete ? colors.green(index) : index;
      const oldIndex = p.isTagComplete ? colors.green(p.oldIndex) : p.oldIndex;
      const timestamp = p.isTagComplete
        ? colors.green(p.timestampDisplay)
        : p.timestampDisplay;
      const content_1 = displaySpeaker(p.speaker_1, speakers, p.content_1),
        content_2 = displaySpeaker(p.speaker_2, speakers, p.content_2);
      table.push([index, oldIndex, timestamp, content_1, content_2]);
    }
    console.log(table.toString());
    const choice = await inquirer
      .prompt([
        {
          type: 'rawlist',
          name: 'choice',
          message: ``,
          choices,
        },
      ])
      .then(async ({ choice }) => choice);
    if (choice === _choices.next) {
      page += 1;
    } else if (choice === _choices.back) {
      page -= 1;
    } else if (choice === _choices.jumpToLatestUntagged) {
      const latestUntaggedIndex = paragraphs.findIndex((p) => !p.isTagComplete);
      page = Math.floor(latestUntaggedIndex / pageSize) + 1;
    } else if (choice === _choices.jumpToIndex) {
      const index = await inquirer
        .prompt([
          {
            type: 'input',
            name: 'index',
            message: 'Input index: ',
          },
        ])
        .then(({ index }) => +index);
      if (index > paragraphs.length - 1) {
        console.log(`Index ${index} is non exist`);
        continue;
      }
      page = Math.floor(index / pageSize) + 1;
    } else if (choice === _choices.jumpToIndex) {
    } else {
      break;
    }
  }
  console.clear();
}

function saveSpeakers(speakers, fileName) {
  fs.writeFileSync(
    `./data/${fileName}-speaker_obj.txt`,
    JSON.stringify(speakers)
  );
  return speakers;
}

async function tagFromLatestUntagged(paragraphs, speakers, fileName) {
  console.clear();
  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    if (p.isTagComplete) {
      continue;
    }
    const { speaker_1, speaker_2 } = await askWhoSpeaker(
      i,
      paragraphs,
      speakers
    );
    if (speaker_1 === 'exit' || speaker_2 === 'exit') {
      break;
    }
    p.isTagComplete = true;
    if (isTruthyExceptZero(speaker_1)) {
      speakers[speaker_1].count += 1;
      p.speaker_1 = speaker_1;
    }
    if (isTruthyExceptZero(speaker_2)) {
      speakers[speaker_2].count += 1;
      p.speaker_2 = speaker_2;
    }
    saveResult(fileName, paragraphs);
    speakers = saveSpeakers(speakers, fileName);
    console.clear();
  }
  console.clear();
}

async function tagFromIndex(paragraphs, speakers, fileName) {
  console.clear();
  const index = await inquirer
    .prompt([
      {
        type: 'input',
        name: 'index',
        message: 'Input index: ',
      },
    ])
    .then(({ index }) => +index);
  const p = paragraphs[index];
  const { speaker_1, speaker_2 } = await askWhoSpeaker(
    index,
    paragraphs,
    speakers
  );
  if (speaker_1 !== 'exit' && speaker_2 !== 'exit') {
    if (isTruthyExceptZero(speaker_1)) {
      speakers[speaker_1].count += 1;
      p.speaker_1 = speaker_1;
    }
    if (isTruthyExceptZero(speaker_2)) {
      speakers[speaker_2].count += 1;
      p.speaker_2 = speaker_2;
    }
    saveResult(fileName, paragraphs);
    speakers = saveSpeakers(speakers, fileName);
    console.clear();
  }
  console.clear();
}

async function renderMainMenu(paragraphs, speakers, fileName) {
  const _choices = {
    printAllParagraph: 'printAllParagraph',
    tagFromLatestUntagged: 'tagFromLatestUntagged',
    tagFromStart: 'tagFromStart',
    export: 'export',
    edit: 'edit',
    exit: 'exit',
  };
  const choices = [
    {
      value: _choices.printAllParagraph,
      name: 'Print result 📊',
    },
    {
      value: _choices.tagFromLatestUntagged,
      name: 'Tag from latest untag ⚒️',
    },
    {
      value: _choices.edit,
      name: 'Edit 📝',
    },
    {
      value: _choices.export,
      name: 'Export 🖨️',
    },
    {
      value: _choices.exit,
      name: 'Exit 🙋‍♂️',
    },
  ];
  while (1) {
    const choice = await inquirer
      .prompt([
        {
          type: 'rawlist',
          name: 'choice',
          message: 'Main menu',
          choices,
        },
      ])
      .then(async ({ choice }) => choice);
    if (choice === _choices.printAllParagraph) {
      await renderTable(paragraphs, speakers);
    } else if (choice === _choices.tagFromLatestUntagged) {
      await tagFromLatestUntagged(paragraphs, speakers, fileName);
    } else if (choice === _choices.export) {
      exportResultAsFile(paragraphs, fileName);
    } else if (choice === _choices.edit) {
      await tagFromIndex(paragraphs, speakers, fileName);
    } else if (_choices.exit) {
      break;
    }
  }
}

export function saveResult(fileName, paragraphs) {
  fs.writeFileSync(
    `./data/${fileName}-built_obj.txt`,
    JSON.stringify(paragraphs)
  );
}

function getLatestResult(fileName) {
  try {
    const result = JSON.parse(
      fs.readFileSync(`./data/${fileName}-built_obj.txt`, 'utf-8')
    );

    logInfo('>> Latest result existed ✍️');
    return result;
  } catch (ex) {
    logInfo('>> No latest result');
    return false;
  }
}

function logInfo(text) {
  console.log(colors.dim(text));
}

export function getParagraphs(fileName) {
  let paragraphs = getLatestResult(fileName);
  if (!paragraphs) {
    logInfo('>> Generating files... ');
    paragraphs = collectData(`${fileName}.srt`);
    logInfo('>> Generated... ');
    paragraphs.sort((a, b) =>
      compareTimestamp(b.timestamp.from, a.timestamp.from)
    );
    saveResult(fileName, paragraphs);
  }

  return paragraphs;
}

function main() {
  const fileName = 'caption.th_TH (3)';
  const paragraphs = getParagraphs(fileName);
  // const speakers = getSpeakers(fileName);
  // renderMainMenu(paragraphs, speakers, fileName);
}

main();
