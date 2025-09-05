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
    navLinksContainer.innerHTML = generateNavigation();
  }
}

// Toggle mobile menu
function toggleMenu() {
  document.getElementById("nav-links").classList.toggle("show");
}

// Initialize navigation when page loads
document.addEventListener("DOMContentLoaded", initializeNavigation);
