// Navigation configuration - UPDATE ONLY HERE to change navigation everywhere
const navigationConfig = [
  { href: "about.html", text: "About" },
  { href: "team.html", text: "Team" },
  { href: "get-involved.html", text: "Get&nbsp;Involved" },
  { href: "news.html", text: "News" },
  { href: "contact.html", text: "Contact" },
];

// Function to generate navigation HTML
function generateNavigation() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  return navigationConfig
    .map((item) => {
      const isCurrentPage = currentPage === item.href;
      const ariaCurrent = isCurrentPage ? ' aria-current="page"' : "";
      return `<li><a href="${item.href}"${ariaCurrent}>${item.text}</a></li>`;
    })
    .join("");
}

// Function to initialize navigation on page load
function initializeNavigation() {
  const navLinksContainer = document.getElementById("nav-links");
  if (navLinksContainer) {
  // Inject a close button row first (mobile drawer)
  const closeRow = `<li class="nav-close-li"><button type="button" class="nav-close-btn" aria-label="Close navigation" onclick="closeMenu()">Close ✕</button></li>`;
  navLinksContainer.innerHTML = closeRow + generateNavigation();
  }
}

// Toggle mobile menu
function ensureBackdrop() {
  let backdrop = document.querySelector(".nav-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    document.body.appendChild(backdrop);
  }
  // Ensure it's not hidden by the hidden attribute
  backdrop.removeAttribute("hidden");
  return backdrop;
}

function openMenu() {
  const list = document.getElementById("nav-links");
  const btn = document.querySelector(".menu-toggle");
  if (!list) return;
  list.classList.add("show");
  document.body.classList.add("nav-open");
  if (btn) btn.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
  const list = document.getElementById("nav-links");
  const btn = document.querySelector(".menu-toggle");
  if (!list) return;
  list.classList.remove("show");
  document.body.classList.remove("nav-open");
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

function toggleMenu() {
  const isOpen = document
    .getElementById("nav-links")
    ?.classList.contains("show");
  if (isOpen) closeMenu();
  else openMenu();
}

// Initialize navigation when page loads
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation();
  const btn = document.querySelector(".menu-toggle");
  if (btn) {
    btn.setAttribute("aria-controls", "nav-links");
    btn.setAttribute("aria-expanded", "false");
  }
  const backdrop = ensureBackdrop();
  backdrop.addEventListener("click", closeMenu);
  // Close when clicking outside the drawer (fallback)
  document.addEventListener("click", (e) => {
    const list = document.getElementById("nav-links");
    const btn2 = document.querySelector(".menu-toggle");
    if (!document.body.classList.contains("nav-open")) return;
    if (list && list.contains(e.target)) return;
    if (btn2 && btn2.contains(e.target)) return;
    closeMenu();
  });
  // Close on link click inside the drawer
  const list = document.getElementById("nav-links");
  if (list) {
    list.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.tagName === "A") closeMenu();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Close the drawer automatically when switching to desktop
  const onResize = () => {
    if (window.innerWidth >= 980) closeMenu();
  };
  window.addEventListener('resize', onResize);
});
