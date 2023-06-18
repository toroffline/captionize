const DEFAULT_PREVIEW_TEXT = '...';
const SPEAKER_TEXT_FORMAT = '[{name}]';

function isTruthyIncludeZero(value) {
  return !!value || value === 0;
}

function composeId(elementId, paragraphIndex, contentIndex, speakerIndex) {
  let result = `${elementId}-paragraph-${paragraphIndex}`;
  if (contentIndex) {
    result += `-content-${contentIndex}`;
  }
  if (isTruthyIncludeZero(speakerIndex)) {
    result += `-speaker-${speakerIndex}`;
  }

  return result;
}

function previewText(paragraph, speakers) {
  const contents = paragraph.contents;
  const previewTextEl = document.getElementById('text-preview');
  let textContent = '';
  for (let i = 0; i < contents.length; i++) {
    const content = contents[i];
    if (i > 0) {
      textContent += '\r\n';
    }
    if (isTruthyIncludeZero(content.speaker)) {
      textContent += `${SPEAKER_TEXT_FORMAT.replace(
        '{name}',
        speakers[content.speaker].name
      )} `;
    }
    textContent += content.content;
  }
  previewTextEl.textContent = textContent;
  seekTo(paragraph.timestamp);
}

function createSpeakersBtnGroup(
  paragraphIndex,
  contentIndex,
  speakers,
  contentObj
) {
  const div = document.createElement('div');
  div.setAttribute('class', 'btn-group');
  div.setAttribute('role', 'group');
  for (let i = 0; i < speakers.length; i++) {
    const s = speakers[i];
    const btn = document.createElement('button');
    btn.setAttribute(
      'id',
      composeId('btn-row', paragraphIndex, contentIndex, i)
    );
    btn.setAttribute('class', 'btn btn-outline-info');
    btn.setAttribute('type', 'button');
    btn.value = i;
    btn.textContent = s.name;
    div.appendChild(btn);

    btn.addEventListener('click', (e) => {
      const group = document.querySelectorAll(
        `[id^=${composeId('btn-row', paragraphIndex, contentIndex)}]`
      );
      let speakerName = '';
      let speakerValue = null;
      const speakerTxt = document.getElementById(
        composeId('text-speaker', paragraphIndex, contentIndex)
      );
      if (e.currentTarget.classList.contains('active')) {
        e.currentTarget.classList.remove('active');
      } else {
        for (let element of group) {
          element.classList.remove('active');
        }
        e.currentTarget.classList.add('active');
        speakerName = s.name;
        speakerValue = i;
      }
      speakerTxt.textContent = speakerName;
      contentObj.speaker = speakerValue;
    });
  }

  return div;
}

function createInputGroup(paragraphIndex, contentIndex, content) {
  const div = document.createElement('div');
  div.setAttribute('class', 'input-group mb-3');
  const span = document.createElement('span');
  span.setAttribute('class', 'input-group-text');
  span.setAttribute(
    'id',
    composeId('text-speaker', paragraphIndex, contentIndex)
  );
  const input = document.createElement('input');
  input.setAttribute(
    'id',
    composeId('input-content', paragraphIndex, contentIndex)
  );
  input.setAttribute('class', 'form-control');
  input.value = content.content;
  div.appendChild(span);
  div.appendChild(input);

  input.addEventListener('keyup', (e) => {
    const value = e.currentTarget.value;
    content.content = value;
  });

  return div;
}

function tableRowEvent(trEl, paragraph, speakers) {
  const activeClassName = 'table-active';
  trEl.addEventListener('click', (e) => {
    const trs = document.querySelectorAll(`[id^=paragraph-tr]`);
    if (e.currentTarget.classList.contains(activeClassName)) {
      e.currentTarget.classList.remove(activeClassName);
    } else {
      for (let tr of trs) {
        tr.classList.remove(activeClassName);
      }
      e.currentTarget.classList.add(activeClassName);
    }
    previewText(paragraph, speakers);
  });
}

function buildContentSection(
  paragraph,
  speakers,
  paragraphIndex,
  contentIndex
) {
  const contentObj = paragraph.contents[contentIndex];
  const contentGroupDiv = document.createElement('div');
  contentGroupDiv.setAttribute('class', 'pb-3');
  const contentInputEl = createInputGroup(
    paragraphIndex,
    contentIndex,
    contentObj
  );
  contentGroupDiv.appendChild(contentInputEl);
  contentGroupDiv.appendChild(
    createSpeakersBtnGroup(paragraphIndex, contentIndex, speakers, contentObj)
  );
  const removeBtn = document.createElement('btn');
  removeBtn.setAttribute('type', 'button');
  removeBtn.setAttribute('class', 'ml-1 btn btn-outline-danger');
  removeBtn.textContent = '🗑️ Remove';
  removeBtn.addEventListener('click', () => {
    const removeIndex = Array.from(contentGroupDiv.parentNode.children).indexOf(
      contentGroupDiv
    );
    paragraph.contents.splice(removeIndex, 1);
    contentGroupDiv.parentNode.removeChild(contentGroupDiv);
  });
  contentGroupDiv.appendChild(removeBtn);

  return contentGroupDiv;
}

function renderTable(paragraphs, speakers) {
  const tbody = document.getElementById('tableBody');
  for (
    let paragraphIndex = 0;
    paragraphIndex < paragraphs.length;
    paragraphIndex++
  ) {
    const paragraph = paragraphs[paragraphIndex];
    const trEl = document.createElement('tr');
    trEl.setAttribute('id', composeId('paragraph-tr', paragraphIndex));
    tableRowEvent(trEl, paragraph, speakers);
    const tdEl = {
      index: document.createElement('td'),
      oldIndex: document.createElement('td'),
      timestamp: document.createElement('td'),
      content: document.createElement('td'),
    };
    tdEl.index.textContent = paragraphIndex;
    tdEl.oldIndex.textContent = paragraph.oldIndex;
    tdEl.timestamp.textContent = paragraph.timestampDisplay.replaceAll(
      '-->',
      '→'
    );
    tdEl.index.setAttribute('id', `td-index-${paragraphIndex}`);
    tdEl.index.setAttribute('id', `td-old-index-${paragraphIndex}`);
    tdEl.index.setAttribute('id', `td-timestamp-${paragraphIndex}`);

    for (
      let contentIndex = 0;
      contentIndex < paragraph.contents.length;
      contentIndex++
    ) {
      tdEl.content.appendChild(
        buildContentSection(paragraph, speakers, paragraphIndex, contentIndex)
      );
    }

    const addBtn = document.createElement('btn');
    addBtn.setAttribute('type', 'button');
    addBtn.setAttribute('class', 'btn btn-outline-success');
    addBtn.textContent = '➕ Add';
    tdEl.content.appendChild(addBtn);

    addBtn.addEventListener('click', (e) => {
      paragraph.contents = [
        ...paragraph.contents,
        {
          content: '',
          speaker: null,
        },
      ];
      tdEl.content.insertBefore(
        buildContentSection(
          paragraph,
          speakers,
          paragraphIndex,
          paragraph.contents.length - 1
        ),
        tdEl.content.childNodes[tdEl.content.childNodes.length - 1]
      );
    });

    Object.keys(tdEl).forEach((k) => {
      trEl.appendChild(tdEl[k]);
    });
    tbody.appendChild(trEl);
  }
}

/* -------------------------------------------- VIDEO -------------------------------------------------- */

const API_KEY = 'AIzaSyBf63TlJYg3F1rcmA4tVbyoWzWsNp24Z44';

const videoId = 'u0aWLBjBMgw';
let player;

function convertDurationToSeconds(h, m, s) {
  let seconds = 0;
  if (h) {
    seconds += parseInt(h) * 3600;
  }
  if (m) {
    seconds += parseInt(m) * 60;
  }
  if (s) {
    seconds += parseInt(s);
  }

  return seconds;
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '320',
    width: '640',
    videoId: videoId,
    playerVars: {
      controls: 1,
      enablejsapi: 1,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerReady(event) {
  const timestamp = 10;
  event.target.seekTo(timestamp);
  event.target.playVideo();
  setInterval(checkPlaybackTime, 1000);
}

function checkPlaybackTime() {
  const currentTime = player.getCurrentTime();
  // console.log("Current time:", currentTime);
}

function seekTo(timestamp) {
  const { h, m, s } = timestamp.from;
  player.seekTo(convertDurationToSeconds(h, m, s), true);
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    console.log('Video playback ended');
  }
}

function loadYouTubePlayer() {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function getFilenameFromResponse(response) {
  const contentDisposition = response.headers.get('Content-Disposition');
  const filenameMatch =
    contentDisposition &&
    contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  return filenameMatch ? decodeURIComponent(filenameMatch[1]) : 'result.srt';
}

async function saveResult(paragraphs) {
  await fetch('http://localhost:3000/api/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: paragraphs }),
  })
    .then((response) => console.log({ response }))
    .catch((error) => {
      console.error('Error downloading file:', error);
    });
}

async function exportResult(paragraphs) {
  await fetch('http://localhost:3000/api/export', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: paragraphs }),
  })
    .then((response) => {
      const fileName = getFilenameFromResponse(response);
      return response.blob().then((blob) => ({ fileName, blob }));
    })
    .then(({ fileName, blob }) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error('Error downloading file:', error);
    });
}

async function main() {
  const { paragraphs, speakers } = await fetch(
    'http://localhost:3000/api/paragraph'
  )
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  renderTable(paragraphs, speakers);

  const previewTextEl = document.getElementById('text-preview');
  previewTextEl.textContent = DEFAULT_PREVIEW_TEXT;

  const exportBtn = document.getElementById('btn-export');
  exportBtn.addEventListener('click', () => {
    exportResult(paragraphs);
  });

  const saveBtn = document.getElementById('btn-save');
  saveBtn.addEventListener('click', () => {
    saveResult(paragraphs);
  });

  loadYouTubePlayer();
}

main();
