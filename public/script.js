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
  if (btn) btn.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  const list = document.getElementById("nav-links");
  const btn = document.querySelector(".menu-toggle");
  if (!list) return;
  list.classList.remove("show");
  document.body.classList.remove("nav-open");
  if (btn) btn.setAttribute("aria-expanded", "false");
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
  // Render modern footer on all pages
  initializeFooter();
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
  window.addEventListener("resize", onResize);
});

// ===============
// Footer Renderer
// ===============
function renderFooterHTML() {
  const year = new Date().getFullYear();
  return `
    <div class="container footer-wrap">
      <section class="footer-top cardish">
        <div class="footer-cta">
          <div class="cta-text">
            <h3 class="cta-title">Stay in the loop</h3>
            <p class="cta-sub">News, programs, and ways to get involved—no spam.</p>
          </div>
          <form class="cta-form" id="footer-subscribe" aria-label="Subscribe to updates">
            <label class="visually-hidden" for="footer-email">Email</label>
            <input id="footer-email" name="email" type="email" placeholder="you@example.com" required />
            <button class="btn alt" type="submit">Subscribe</button>
          </form>
          <div class="cta-actions">
            <a class="btn ghost small" href="get-involved.html">Get Involved</a>
            <a class="btn primary small" href="donate.html">Donate</a>
          </div>
        </div>
      </section>

      <section class="footer-grid">
        <div class="footer-branding">
          <a href="index.html" class="brand-tile">
            <img src="assets/logo.png" alt="BYC Logo" />
            <div>
              <strong>Beacon Youth Collective</strong>
              <span>Bertoua, Cameroon</span>
            </div>
          </a>
          <p class="muted">Youth-led. Evidence-driven. Community-rooted.</p>
          <nav class="footer-social" aria-label="Social media">
            <a aria-label="Twitter" href="https://x.com/beaconyouths" target="_blank" rel="noopener noreferrer" title="Twitter" class="soc">${svgIcon(
              "twitter"
            )}</a>
            <a aria-label="Facebook" href="#" title="Facebook" class="soc">${svgIcon(
              "facebook"
            )}</a>
            <a aria-label="Instagram" href="https://www.instagram.com/beaconyouths" target="_blank" rel="noopener noreferrer" title="Instagram" class="soc">${svgIcon(
              "instagram"
            )}</a>
            <a aria-label="LinkedIn" href="#" title="LinkedIn" class="soc">${svgIcon(
              "linkedin"
            )}</a>
            <a aria-label="YouTube" href="#" title="YouTube" class="soc">${svgIcon(
              "youtube"
            )}</a>
          </nav>
        </div>

        <div class="footer-links">
          <strong>Programs</strong>
          <ul>
            <li><a href="education.html">Education</a></li>
            <li><a href="climate.html">Climate Action</a></li>
            <li><a href="tech.html">Tech for Good</a></li>
            <li><a href="gbv.html">Gender &amp; GBV</a></li>
          </ul>
        </div>

        <div class="footer-links">
          <strong>Explore</strong>
          <ul>
            <li><a href="about.html">About</a></li>
            <li><a href="team.html">Team</a></li>
            <li><a href="news.html">News</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>

        <div class="footer-links">
          <strong>Actions</strong>
          <ul>
            <li><a href="get-involved.html">Get Involved</a></li>
            <li><a href="donate.html">Donate</a></li>
            <li><a href="admin.html">Admin</a></li>
          </ul>
        </div>
      </section>

      <section class="footer-bottom">
        <p>© ${year} Beacon Youth Collective</p>
        <ul class="bottom-links">
          <li><a href="privacy.html">Privacy</a></li>
          <li><a href="terms.html">Terms</a></li>
        </ul>
      </section>
    </div>`;
}

function initializeFooter() {
  let footer = document.querySelector("footer");
  if (!footer) {
    footer = document.createElement("footer");
    document.body.appendChild(footer);
  }
  footer.classList.add("site-footer");
  footer.innerHTML = renderFooterHTML();

  const form = footer.querySelector("#footer-subscribe");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearFormError(form);
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button[type="submit"]');
      const email = input?.value?.trim();
      if (!isValidEmail(email)) {
        showFormError(form, "Please enter a valid email address.");
        input?.focus();
        return;
      }
      setLoading(btn, true, "Subscribing…");

      try {
        const result = await submitNewsletter(email);
        localStorage.setItem("byc_subscribed_email", email);
        replaceFormWithSuccess(form, email);
        if (result?.queued && result?.deferred) {
          showToast("Saved & will sync soon.", "info");
        } else if (result?.queued) {
          showToast("Queued offline—will sync when online.", "info");
        } else {
          showToast("You're subscribed. Welcome!", "success");
        }
      } catch (err) {
        console.error("Subscription critical failure", err);
        showFormError(form, "Subscription failed. Please try again.");
      } finally {
        setLoading(btn, false);
      }
    });
  }
}

function svgIcon(name) {
  const common =
    'width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"';
  switch (name) {
    case "twitter":
      return `<svg ${common}><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.27 4.27 0 0 0 1.88-2.36 8.54 8.54 0 0 1-2.71 1.05 4.26 4.26 0 0 0-7.35 3.89A12.08 12.08 0 0 1 3.15 4.6a4.25 4.25 0 0 0 1.32 5.68 4.22 4.22 0 0 1-1.93-.53v.05a4.26 4.26 0 0 0 3.42 4.18 4.3 4.3 0 0 1-1.92.07 4.26 4.26 0 0 0 3.98 2.96A8.54 8.54 0 0 1 2 19.54a12.06 12.06 0 0 0 6.53 1.91c7.84 0 12.13-6.49 12.13-12.12 0-.18 0-.37-.01-.55A8.65 8.65 0 0 0 22.46 6z"/></svg>`;
    case "facebook":
      return `<svg ${common}><path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07C1.86 17.09 5.62 21.2 10.38 22v-7.03H7.9v-2.9h2.48V9.41c0-2.45 1.46-3.8 3.7-3.8 1.07 0 2.2.19 2.2.19v2.42h-1.24c-1.22 0-1.6.76-1.6 1.54v1.85h2.72l-.43 2.9h-2.29V22c4.76-.8 8.52-4.91 8.52-9.93z"/></svg>`;
    case "instagram":
      return `<svg ${common}><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.51 5.51 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zM18 6.2a1.2 1.2 0 1 1-1.2 1.2A1.2 1.2 0 0 1 18 6.2z"/></svg>`;
    case "linkedin":
      return `<svg ${common}><path d="M20.45 20.45h-3.56v-5.16c0-1.23-.02-2.8-1.71-2.8-1.71 0-1.97 1.34-1.97 2.72v5.24H9.65V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.36-1.85c3.6 0 4.26 2.37 4.26 5.45v6.29zM6.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM8.12 20.45H4.56V9h3.56v11.45z"/></svg>`;
    case "youtube":
      return `<svg ${common}><path d="M23.5 7.5a3 3 0 0 0-2.1-2.1C19.5 5 12 5 12 5s-7.5 0-9.4.4A3 3 0 0 0 .5 7.5 31.2 31.2 0 0 0 .1 12a31.2 31.2 0 0 0 .4 4.5 3 3 0 0 0 2.1 2.1C4.5 19 12 19 12 19s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1 31.2 31.2 0 0 0 .4-4.5 31.2 31.2 0 0 0-.4-4.5zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>`;
    default:
      return "";
  }
}

// =====================
// Subscribe UX helpers
// =====================
function isValidEmail(v) {
  if (!v) return false;
  // Simple robust regex without being too strict
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

function setLoading(btn, isLoading, label) {
  if (!btn) return;
  if (isLoading) {
    btn.dataset.originalText = btn.textContent;
    if (label) btn.textContent = label;
    btn.classList.add("loading");
    btn.setAttribute("disabled", "true");
  } else {
    if (btn.dataset.originalText) btn.textContent = btn.dataset.originalText;
    btn.classList.remove("loading");
    btn.removeAttribute("disabled");
  }
}

function showFormError(form, message) {
  let err = form.querySelector(".form-error");
  if (!err) {
    err = document.createElement("div");
    err.className = "form-error";
    err.setAttribute("role", "alert");
    err.setAttribute("aria-live", "polite");
    form.appendChild(err);
  }
  err.textContent = message;
  const input = form.querySelector('input[type="email"]');
  input?.classList.add("input-error");
}

function clearFormError(form) {
  const err = form.querySelector(".form-error");
  if (err) err.remove();
  const input = form.querySelector('input[type="email"]');
  input?.classList.remove("input-error");
}

function replaceFormWithSuccess(form, email) {
  const wrap = document.createElement("div");
  wrap.className = "cta-success";
  wrap.setAttribute("role", "status");
  wrap.setAttribute("aria-live", "polite");
  wrap.innerHTML = `
    <button type="button" class="dismiss" aria-label="Dismiss">✕</button>
    <div class="check">✓</div>
    <div class="success-copy">
      <h4 class="success-title">You're subscribed</h4>
      <p class="success-sub">We'll send occasional updates to <strong>${escapeHtml(
        email
      )}</strong>. You can unsubscribe anytime via the email footer.</p>
    </div>
  `;
  // Insert success panel above the form, keep the form visible for new subscriptions
  form.parentNode?.insertBefore(wrap, form);
  try {
    form.reset();
  } catch (_) {}
  // Move focus to success title for accessibility
  wrap.querySelector(".success-title")?.focus?.();
  // Allow manual dismiss
  wrap
    .querySelector(".dismiss")
    ?.addEventListener("click", () => wrap.remove());
}

function showToast(message, type = "info") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const item = document.createElement("div");
  item.className = `toast ${type}`;
  item.innerHTML = `<span class="toast-msg">${escapeHtml(
    message
  )}</span><button class="toast-close" aria-label="Dismiss notification">✕</button>`;
  container.appendChild(item);
  const showT = setTimeout(() => item.classList.add("show"), 20);
  const hideT = setTimeout(() => {
    item.classList.remove("show");
    setTimeout(() => item.remove(), 300);
  }, 4200);
  // Manual close
  item.querySelector(".toast-close")?.addEventListener("click", (e) => {
    e.stopPropagation();
    clearTimeout(showT);
    clearTimeout(hideT);
    item.classList.remove("show");
    setTimeout(() => item.remove(), 150);
  });
}

function escapeHtml(s) {
  return s.replace(
    /[&<>"]+/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
  );
}

// Simplified submit: direct Firestore call via single import, no offline queue
// Local-only subscriber storage (no Firebase). Stored under `byc_local_subscribers`.
function getLocalSubscribers() {
  try {
    return JSON.parse(localStorage.getItem("byc_local_subscribers") || "[]");
  } catch (_) {
    return [];
  }
}
function setLocalSubscribers(list) {
  try {
    localStorage.setItem(
      "byc_local_subscribers",
      JSON.stringify(list.slice(-1000))
    ); // cap
  } catch (_) {}
}
function storeLocalSubscriber(email, source = "footer-cta") {
  const list = getLocalSubscribers();
  // avoid duplicates (case-insensitive)
  if (!list.some((e) => e.email.toLowerCase() === email.toLowerCase())) {
    list.push({ email, source, createdAt: Date.now() });
    setLocalSubscribers(list);
  }
  return list;
}
async function submitNewsletter(email) {
  storeLocalSubscriber(email);
  // Broadcast to other tabs/admin via storage event helper
  try {
    localStorage.setItem("byc_last_subscriber_added", Date.now() + ":" + email);
  } catch (_) {}
  return { ok: true, local: true };
}
