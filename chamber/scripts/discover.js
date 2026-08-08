import discoverItems from "../data/discover.mjs";

const grid = document.getElementById("discover-grid");
const modal = document.getElementById("discover-modal");
const modalTitle = document.getElementById("discover-modal-title");
const modalAddress = document.getElementById("discover-modal-address");
const modalText = document.getElementById("discover-modal-text");
const modalCloseBtn = modal.querySelector(".modal-close");

function buildCard(item) {
  const article = document.createElement("article");
  article.className = `discover-card card-${item.area}`;

  article.innerHTML = `
    <figure>
      <img src="images/discover/${item.image}" alt="${item.name}" loading="lazy">
    </figure>
    <div class="discover-card-body">
      <h2>${item.name}</h2>
      <address>${item.address}</address>
      <p>${item.description}</p>
      <button type="button" class="learn-more-btn" data-id="${item.id}">Learn More</button>
    </div>
  `;

  return article;
}

function renderCards() {
  const fragment = document.createDocumentFragment();
  discoverItems.forEach((item) => fragment.appendChild(buildCard(item)));
  grid.appendChild(fragment);
}

function openModal(id) {
  const item = discoverItems.find((entry) => entry.id === id);
  if (!item) return;

  modalTitle.textContent = item.name;
  modalAddress.textContent = item.address;
  modalText.textContent = item.learnMore;
  modal.showModal();
}

grid?.addEventListener("click", (event) => {
  const button = event.target.closest(".learn-more-btn");
  if (button) {
    openModal(button.dataset.id);
  }
});

modalCloseBtn.addEventListener("click", () => modal.close());

modal.addEventListener("click", (event) => {
  const rect = modal.getBoundingClientRect();
  const clickedInside =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;
  if (!clickedInside) {
    modal.close();
  }
});

renderCards();

/* ===== Last visit message (localStorage) ===== */

const VISIT_KEY = "dentonChamberLastVisit";
const visitMessageEl = document.getElementById("visit-message");
const visitMessageText = document.getElementById("visit-message-text");
const visitMessageClose = document.getElementById("visit-message-close");

function buildVisitMessage() {
  const lastVisit = localStorage.getItem(VISIT_KEY);
  const now = Date.now();

  let message;

  if (!lastVisit) {
    message = "Welcome! Let us know if you have any questions.";
  } else {
    const msSinceLastVisit = now - Number(lastVisit);
    const oneDay = 1000 * 60 * 60 * 24;

    if (msSinceLastVisit < oneDay) {
      message = "Back so soon! Awesome!";
    } else {
      const days = Math.floor(msSinceLastVisit / oneDay);
      const unit = days === 1 ? "day" : "days";
      message = `You last visited ${days} ${unit} ago.`;
    }
  }

  localStorage.setItem(VISIT_KEY, String(now));
  return message;
}

if (visitMessageEl && visitMessageText) {
  visitMessageText.textContent = buildVisitMessage();
}

visitMessageClose?.addEventListener("click", () => {
  visitMessageEl.classList.add("is-hidden");
});
