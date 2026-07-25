const directory = document.getElementById("directory");
const gridBtn = document.getElementById("grid-view-btn");
const listBtn = document.getElementById("list-view-btn");

function setView(view) {
  const isGrid = view === "grid";
  directory.classList.toggle("grid-view", isGrid);
  directory.classList.toggle("list-view", !isGrid);
  gridBtn.classList.toggle("active", isGrid);
  listBtn.classList.toggle("active", !isGrid);
}

gridBtn.addEventListener("click", () => setView("grid"));
listBtn.addEventListener("click", () => setView("list"));

function buildCard(member) {
  const levelLabel = membershipLabels[member.membershipLevel] || "Member";
  const emailRow = member.email
    ? `<div><dt>Email</dt><dd>${member.email}</dd></div>`
    : "";

  return `
    <article class="business-card">
      <div class="card-header">
        <h3>${member.name}</h3>
        <p class="tag-line">${member.tagline}</p>
      </div>
      <div class="card-body">
        <div class="card-image">
          <img src="images/${member.image}" alt="${member.name} logo"
               loading="lazy"
               onerror="this.remove()">
        </div>
        <dl class="card-details">
          ${emailRow}
          <div><dt>Phone</dt><dd>${member.phone}</dd></div>
          <div><dt>Address</dt><dd>${member.address}</dd></div>
          <div><dt>URL</dt><dd><a href="${member.url}" target="_blank" rel="noopener">${member.url.replace(/^https?:\/\//, "")}</a></dd></div>
          <div><dt>Level</dt><dd class="membership-badge membership-${member.membershipLevel}">${levelLabel}</dd></div>
        </dl>
      </div>
    </article>
  `;
}

async function loadDirectory() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }
    const data = await response.json();

    const cardsHtml = data.members.map(buildCard).join("");
    directory.insertAdjacentHTML("beforeend", cardsHtml);
  } catch (error) {
    directory.insertAdjacentHTML(
      "beforeend",
      `<p class="directory-error">Sorry, member information could not be loaded right now.</p>`
    );
    console.error("Error loading member directory:", error);
  }
}

loadDirectory();
