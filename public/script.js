// Navigation config — update here to change nav everywhere.
// Items may include `children` for a simple dropdown.
const navigationConfig = [
  {
    text: "Programs",
    children: [
      { href: "education.html", text: "Education" },
      { href: "climate.html", text: "Climate Action" },
      { href: "tech.html", text: "Tech for Good" },
      { href: "gbv.html", text: "Gender & GBV" },
    ],
  },
  { href: "about.html", text: "About" },
  { href: "team.html", text: "Team" },
  { href: "news.html", text: "News" },
  { href: "contact.html", text: "Contact" },
  { href: "donate.html", text: "Donate", cta: true },
];

function currentFile() {
  return window.location.pathname.split("/").pop() || "index.html";
}

function generateNavigation() {
  const currentPage = currentFile();
  return navigationConfig
    .map((item) => {
      if (item.children) {
        const isActiveGroup = item.children.some((c) => c.href === currentPage);
        const links = item.children
          .map((c) => `<a href="${c.href}"${c.href === currentPage ? ' aria-current="page"' : ""}>${c.text}</a>`)
          .join("");
        return `<li class="nav-has-dropdown${isActiveGroup ? " active-group" : ""}">
          <button class="nav-dropdown-toggle" aria-expanded="false">${item.text}</button>
          <div class="nav-dropdown">${links}</div>
        </li>`;
      }
      const isCurrentPage = currentPage === item.href;
      const ariaCurrent = isCurrentPage ? ' aria-current="page"' : "";
      const liClass = item.cta ? ' class="nav-donate"' : "";
      return `<li${liClass}><a href="${item.href}"${ariaCurrent}>${item.text}</a></li>`;
    })
    .join("");
}

function initializeNavigation() {
  const container = document.getElementById("nav-links");
  if (!container) return;
  container.innerHTML = generateNavigation();

  container.querySelectorAll(".nav-dropdown-toggle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const li = btn.closest(".nav-has-dropdown");
      const isOpen = li.classList.contains("open");
      container.querySelectorAll(".nav-has-dropdown.open").forEach((el) => el.classList.remove("open"));
      li.classList.toggle("open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
  });
}

function toggleMenu() {
  const nav = document.getElementById("nav-links");
  nav.classList.toggle("show");
}

// Close mobile menu / dropdowns when clicking outside
document.addEventListener("click", (e) => {
  const nav = document.getElementById("nav-links");
  const toggle = document.querySelector(".menu-toggle");
  if (nav && nav.classList.contains("show") && !nav.contains(e.target) && e.target !== toggle) {
    nav.classList.remove("show");
  }
  if (nav) {
    nav.querySelectorAll(".nav-has-dropdown.open").forEach((el) => {
      if (!el.contains(e.target)) el.classList.remove("open");
    });
  }
});

// Inject back-to-top button
function initBackToTop() {
  const btn = document.createElement("button");
  btn.className = "back-to-top";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  document.body.appendChild(btn);

  const onScroll = () => {
    btn.classList.toggle("visible", window.scrollY > 500);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation();
  initBackToTop();
});
