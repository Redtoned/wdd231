// Grid / List view toggle
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

// Mobile nav toggle
const navToggle = document.getElementById("nav-toggle");
const siteNav = document.querySelector(".site-nav");

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

// Dark / light mode toggle
const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
  const isDark = document.body.getAttribute("data-theme") === "dark";
  document.body.setAttribute("data-theme", isDark ? "light" : "dark");
});

// Footer dynamic dates
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("last-modified").textContent = new Date(
  document.lastModified
).toLocaleString();
