function createSpeakersBtnGroup(paragraphIndex, contentIndex, speakers) {
  const div = document.createElement("div");
  div.setAttribute("class", "btn-group");
  div.setAttribute("role", "group");
  for (let i = 0; i < speakers.length; i++) {
    const s = speakers[i];
    const btn = document.createElement("button");
    btn.setAttribute("id", `btn-row-${paragraphIndex}-speaker-${i}`);
    btn.setAttribute("class", "btn btn-outline-primary");
    btn.setAttribute("type", "button");
    btn.value = i;
    btn.textContent = s.name;
    div.appendChild(btn);
  }

  return div;
}

function createInputGroup(id, value) {
  const div = document.createElement("div");
  div.setAttribute("class", "input-group mb-3");
  const span = document.createElement("span");
  span.setAttribute("class", "input-group-text");
  const input = document.createElement("input");
  input.setAttribute("id", id);
  input.setAttribute("class", "form-control");
  input.value = value;
  div.appendChild(span);
  div.appendChild(input);

  return div;
}

function renderTable(paragraphs, speakers) {
  const tbody = document.getElementById("tableBody");
  const speakerTh = document.getElementById("speakerTh");
  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    const trEl = document.createElement("tr");
    const tdEl = {
      index: document.createElement("td"),
      oldIndex: document.createElement("td"),
      timestamp: document.createElement("td"),
      content1: document.createElement("td"),
      content2: document.createElement("td"),
    };
    tdEl.index.textContent = i;
    tdEl.oldIndex.textContent = p.oldIndex;
    tdEl.timestamp.textContent = p.timestampDisplay.replaceAll("-->", "→");
    tdEl.index.setAttribute("id", `td-index-${i}`);
    tdEl.index.setAttribute("id", `td-old-index-${i}`);
    tdEl.index.setAttribute("id", `td-timestamp-${i}`);

    for (let j = 0; j < p.contents.length; j++) {
      let content = p.contents[j].content;
      const contentGroupDiv = document.createElement("div");
      contentGroupDiv.setAttribute("class", "pb-3");
      const contentInputEl = createInputGroup(
        `input-content-${i}`,
        content
      );
      contentGroupDiv.appendChild(contentInputEl);
      contentGroupDiv.appendChild(createSpeakersBtnGroup(i, 1, speakers));
      tdEl.content1.appendChild(contentGroupDiv);
    }

    Object.keys(tdEl).forEach((k) => {
      trEl.appendChild(tdEl[k]);
    });
    tbody.appendChild(trEl);
  }
}

async function main() {
  const { paragraphs, speakers } = await fetch("http://localhost:3000/data")
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  renderTable(paragraphs, speakers);
}

main();
