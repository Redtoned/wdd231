const navToggle = document.getElementById("nav-toggle");
const siteNav = document.querySelector(".site-nav");

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
  const isDark = document.body.getAttribute("data-theme") === "dark";
  document.body.setAttribute("data-theme", isDark ? "light" : "dark");
});

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("last-modified").textContent = new Date(
  document.lastModified
).toLocaleString();

const membershipLabels = {
  1: "Member",
  2: "Silver Member",
  3: "Gold Member",
};
