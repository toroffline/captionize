const DEFAULT_PREVIEW_TEXT = "...";
const SPEAKER_TEXT_FORMAT = "[{name}]";

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
  const previewTextEl = document.getElementById("text-preview");
  let textContent = "";
  for (let i = 0; i < contents.length; i++) {
    const content = contents[i];
    if (i > 0) {
      textContent += "\r\n";
    }
    if (isTruthyIncludeZero(content.speaker)) {
      textContent += `${SPEAKER_TEXT_FORMAT.replace(
        "{name}",
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
  const div = document.createElement("div");
  div.setAttribute("class", "btn-group");
  div.setAttribute("role", "group");
  for (let i = 0; i < speakers.length; i++) {
    const s = speakers[i];
    const btn = document.createElement("button");
    btn.setAttribute(
      "id",
      composeId("btn-row", paragraphIndex, contentIndex, i)
    );
    btn.setAttribute("class", "btn btn-outline-primary");
    btn.setAttribute("type", "button");
    btn.value = i;
    btn.textContent = s.name;
    div.appendChild(btn);

    btn.addEventListener("click", (e) => {
      const group = document.querySelectorAll(
        `[id^=${composeId("btn-row", paragraphIndex, contentIndex)}]`
      );
      let speakerName = "";
      let speakerValue = null;
      const speakerTxt = document.getElementById(
        composeId("text-speaker", paragraphIndex, contentIndex)
      );
      if (e.currentTarget.classList.contains("active")) {
        e.currentTarget.classList.remove("active");
      } else {
        for (let element of group) {
          element.classList.remove("active");
        }
        e.currentTarget.classList.add("active");
        speakerName = s.name;
        speakerValue = i;
      }
      speakerTxt.textContent = speakerName;
      contentObj.speaker = speakerValue;
    });
  }

  return div;
}

function createInputGroup(paragraphIndex, contentIndex, value) {
  const div = document.createElement("div");
  div.setAttribute("class", "input-group mb-3");
  const span = document.createElement("span");
  span.setAttribute("class", "input-group-text");
  span.setAttribute(
    "id",
    composeId("text-speaker", paragraphIndex, contentIndex)
  );
  const input = document.createElement("input");
  input.setAttribute(
    "id",
    composeId("input-content", paragraphIndex, contentIndex)
  );
  input.setAttribute("class", "form-control");
  input.value = value;
  div.appendChild(span);
  div.appendChild(input);

  return div;
}

function tableRowEvent(trEl, paragraph, speakers) {
  const activeClassName = "table-active";
  trEl.addEventListener("click", (e) => {
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

function renderTable(paragraphs, speakers) {
  const tbody = document.getElementById("tableBody");
  for (
    let paragraphIndex = 0;
    paragraphIndex < paragraphs.length;
    paragraphIndex++
  ) {
    const p = paragraphs[paragraphIndex];
    const trEl = document.createElement("tr");
    trEl.setAttribute("id", composeId("paragraph-tr", paragraphIndex));
    tableRowEvent(trEl, p, speakers);
    const tdEl = {
      index: document.createElement("td"),
      oldIndex: document.createElement("td"),
      timestamp: document.createElement("td"),
      content1: document.createElement("td"),
      content2: document.createElement("td"),
    };
    tdEl.index.textContent = paragraphIndex;
    tdEl.oldIndex.textContent = p.oldIndex;
    tdEl.timestamp.textContent = p.timestampDisplay.replaceAll("-->", "→");
    tdEl.index.setAttribute("id", `td-index-${paragraphIndex}`);
    tdEl.index.setAttribute("id", `td-old-index-${paragraphIndex}`);
    tdEl.index.setAttribute("id", `td-timestamp-${paragraphIndex}`);

    for (
      let contentIndex = 0;
      contentIndex < p.contents.length;
      contentIndex++
    ) {
      const contentObj = p.contents[contentIndex];
      let content = contentObj.content;
      const contentGroupDiv = document.createElement("div");
      contentGroupDiv.setAttribute("class", "pb-3");
      const contentInputEl = createInputGroup(
        paragraphIndex,
        contentIndex,
        content
      );
      contentGroupDiv.appendChild(contentInputEl);
      contentGroupDiv.appendChild(
        createSpeakersBtnGroup(
          paragraphIndex,
          contentIndex,
          speakers,
          contentObj
        )
      );
      tdEl.content1.appendChild(contentGroupDiv);
    }

    Object.keys(tdEl).forEach((k) => {
      trEl.appendChild(tdEl[k]);
    });
    tbody.appendChild(trEl);
  }
}

/* -------------------------------------------- VIDEO -------------------------------------------------- */

const API_KEY = "AIzaSyBf63TlJYg3F1rcmA4tVbyoWzWsNp24Z44";

const videoId = "u0aWLBjBMgw";
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
  player = new YT.Player("player", {
    height: "360",
    width: "640",
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
  console.log("Current time:", currentTime);
}

function seekTo(timestamp) {
  const { h, m, s } = timestamp.from;
  player.seekTo(convertDurationToSeconds(h, m, s), true);
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    console.log("Video playback ended");
  }
}

function loadYouTubePlayer() {
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

async function main() {
  const { paragraphs, speakers } = await fetch("http://localhost:3000/data")
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  renderTable(paragraphs, speakers);
  const previewTextEl = document.getElementById("text-preview");
  previewTextEl.textContent = DEFAULT_PREVIEW_TEXT;
  const exportBtn = document.getElementById("btn-export");
  exportBtn.addEventListener("click", (e) => {
    console.log(paragraphs);
  });

  loadYouTubePlayer();
}

main();
