// Navigation config — update here to change nav everywhere
const navigationConfig = [
  { href: "about.html",        text: "About" },
  { href: "team.html",         text: "Team" },
  { href: "get-involved.html", text: "Get Involved" },
  { href: "news.html",         text: "News" },
  { href: "contact.html",      text: "Contact" },
  { href: "donate.html",       text: "Donate", cta: true },
];

function generateNavigation() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  return navigationConfig
    .map((item) => {
      const isCurrentPage = currentPage === item.href;
      const ariaCurrent   = isCurrentPage ? ' aria-current="page"' : "";
      const liClass       = item.cta ? ' class="nav-donate"' : "";
      return `<li${liClass}><a href="${item.href}"${ariaCurrent}>${item.text}</a></li>`;
    })
    .join("");
}

function initializeNavigation() {
  const container = document.getElementById("nav-links");
  if (container) container.innerHTML = generateNavigation();
}

function toggleMenu() {
  const nav = document.getElementById("nav-links");
  nav.classList.toggle("show");
}

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  const nav    = document.getElementById("nav-links");
  const toggle = document.querySelector(".menu-toggle");
  if (nav && nav.classList.contains("show") && !nav.contains(e.target) && e.target !== toggle) {
    nav.classList.remove("show");
  }
});

// Scroll reveal — triggers .reveal elements when they enter the viewport
function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

// Inject floating WhatsApp button (replace PHONE with actual number)
function initWhatsApp() {
  const PHONE = "237XXXXXXXXX"; // replace with BYC WhatsApp number
  const a = document.createElement("a");
  a.className = "whatsapp-float";
  a.href = `https://wa.me/${PHONE}?text=Hi%20Beacon%20Youth%20Collective%2C%20I%27d%20like%20to%20learn%20more%20about%20your%20programs.`;
  a.target = "_blank";
  a.rel = "noopener";
  a.setAttribute("aria-label", "Chat with us on WhatsApp");
  a.innerHTML = '<i class="fab fa-whatsapp"></i><span class="whatsapp-float-tooltip">Chat on WhatsApp</span>';
  document.body.appendChild(a);
}

// Inject back-to-top button
function initBackToTop() {
  const btn = document.createElement("button");
  btn.className = "back-to-top";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = "↑";
  document.body.appendChild(btn);

  const onScroll = () => {
    btn.classList.toggle("visible", window.scrollY > 400);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation();
  initScrollReveal();
  initWhatsApp();
  initBackToTop();
});
