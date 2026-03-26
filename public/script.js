// Shared navigation and footer behavior for all public pages.

const navigationConfig = [
  { href: "about.html", text: "About" },
  { href: "team.html", text: "Team" },
  { href: "get-involved.html", text: "Get&nbsp;Involved" },
  { href: "news.html", text: "News" },
  { href: "contact.html", text: "Contact" },
];

const SUBSCRIBED_EMAILS_KEY = "byc_subscribed_emails";
const SUBSCRIBER_QUEUE_KEY = "byc_subscriber_queue";
let firebaseModulePromise;

function getFirebaseModule() {
  if (!firebaseModulePromise) {
    firebaseModulePromise = import("./firebase.js");
  }
  return firebaseModulePromise;
}

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

function initializeNavigation() {
  const navLinksContainer = document.getElementById("nav-links");
  if (!navLinksContainer) return;

  const closeRow =
    '<li class="nav-close-li"><button type="button" class="nav-close-btn" aria-label="Close navigation" onclick="closeMenu()">Close &times;</button></li>';

  navLinksContainer.innerHTML = closeRow + generateNavigation();
}

function openMenu() {
  const list = document.getElementById("nav-links");
  const button = document.querySelector(".menu-toggle");
  if (!list) return;
  list.classList.add("show");
  document.body.classList.add("nav-open");
  if (button) button.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  const list = document.getElementById("nav-links");
  const button = document.querySelector(".menu-toggle");
  if (!list) return;
  list.classList.remove("show");
  document.body.classList.remove("nav-open");
  if (button) button.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
  const isOpen = document
    .getElementById("nav-links")
    ?.classList.contains("show");

  if (isOpen) closeMenu();
  else openMenu();
}

window.toggleMenu = toggleMenu;
window.closeMenu = closeMenu;

function renderFooterHTML() {
  const year = new Date().getFullYear();

  return `
    <div class="container footer-wrap">
      <section class="footer-top cardish">
        <div class="footer-cta">
          <div class="cta-text">
            <h3 class="cta-title">Stay in the loop</h3>
            <p class="cta-sub">News, programs, and ways to get involved. No spam.</p>
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
            <a aria-label="Instagram" href="https://www.instagram.com/beaconyouths" target="_blank" rel="noopener noreferrer" title="Instagram" class="soc">${svgIcon(
              "instagram"
            )}</a>
            <a aria-label="Contact" href="contact.html" title="Contact" class="soc">${svgIcon(
              "mail"
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
        <p>&copy; ${year} Beacon Youth Collective</p>
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
  if (!form) return;

  const emailInput = form.querySelector('input[type="email"]');
  const remembered = getRememberedSubscribers();
  const lastRemembered = remembered[remembered.length - 1];
  if (emailInput && lastRemembered) {
    emailInput.value = lastRemembered;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFormError(form);

    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');
    const email = input?.value?.trim();

    if (!isValidEmail(email)) {
      showFormError(form, "Please enter a valid email address.");
      input?.focus();
      return;
    }

    if (hasRememberedSubscriber(email)) {
      replaceFormWithSuccess(form, email, true);
      showToast("This email is already on the list.", "info");
      return;
    }

    setLoading(button, true, "Subscribing...");

    try {
      const result = await submitNewsletter(email);
      rememberSubscriber(email);
      replaceFormWithSuccess(form, email, false);

      if (result?.queued) {
        showToast("Saved offline. We will sync it when the connection is back.", "info");
      } else {
        showToast("You're subscribed. Welcome!", "success");
      }
    } catch (err) {
      console.error("Subscription failed", err);
      showFormError(form, "Subscription failed. Please try again.");
    } finally {
      setLoading(button, false);
    }
  });
}

function svgIcon(name) {
  const common =
    'width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"';

  switch (name) {
    case "twitter":
      return `<svg ${common}><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.27 4.27 0 0 0 1.88-2.36 8.54 8.54 0 0 1-2.71 1.05 4.26 4.26 0 0 0-7.35 3.89A12.08 12.08 0 0 1 3.15 4.6a4.25 4.25 0 0 0 1.32 5.68 4.22 4.22 0 0 1-1.93-.53v.05a4.26 4.26 0 0 0 3.42 4.18 4.3 4.3 0 0 1-1.92.07 4.26 4.26 0 0 0 3.98 2.96A8.54 8.54 0 0 1 2 19.54a12.06 12.06 0 0 0 6.53 1.91c7.84 0 12.13-6.49 12.13-12.12 0-.18 0-.37-.01-.55A8.65 8.65 0 0 0 22.46 6z"/></svg>`;
    case "instagram":
      return `<svg ${common}><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.51 5.51 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zM18 6.2a1.2 1.2 0 1 1-1.2 1.2A1.2 1.2 0 0 1 18 6.2z"/></svg>`;
    case "mail":
      return `<svg ${common}><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm0 2v.24l9 6.35 9-6.35V7l-9 6.35L3 7z"/></svg>`;
    default:
      return "";
  }
}

function isValidEmail(value) {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function setLoading(button, isLoading, label) {
  if (!button) return;

  if (isLoading) {
    button.dataset.originalText = button.textContent;
    if (label) button.textContent = label;
    button.classList.add("loading");
    button.setAttribute("disabled", "true");
    return;
  }

  if (button.dataset.originalText) {
    button.textContent = button.dataset.originalText;
  }
  button.classList.remove("loading");
  button.removeAttribute("disabled");
}

function showFormError(form, message) {
  let error = form.querySelector(".form-error");
  if (!error) {
    error = document.createElement("div");
    error.className = "form-error";
    error.setAttribute("role", "alert");
    error.setAttribute("aria-live", "polite");
    form.appendChild(error);
  }

  error.textContent = message;
  const input = form.querySelector('input[type="email"]');
  input?.classList.add("input-error");
}

function clearFormError(form) {
  form.querySelector(".form-error")?.remove();
  const input = form.querySelector('input[type="email"]');
  input?.classList.remove("input-error");
}

function replaceFormWithSuccess(form, email, alreadySubscribed) {
  form.parentNode?.querySelector(".cta-success")?.remove();

  const title = alreadySubscribed ? "Already subscribed" : "You're subscribed";
  const message = alreadySubscribed
    ? `We already have <strong>${escapeHtml(
        email
      )}</strong> on the list.`
    : `We'll send occasional updates to <strong>${escapeHtml(
        email
      )}</strong>. You can unsubscribe anytime from the email footer.`;

  const wrap = document.createElement("div");
  wrap.className = "cta-success";
  wrap.setAttribute("role", "status");
  wrap.setAttribute("aria-live", "polite");
  wrap.innerHTML = `
    <button type="button" class="dismiss" aria-label="Dismiss">&times;</button>
    <div class="check">&check;</div>
    <div class="success-copy">
      <h4 class="success-title" tabindex="-1">${title}</h4>
      <p class="success-sub">${message}</p>
    </div>
  `;

  form.parentNode?.insertBefore(wrap, form);
  try {
    form.reset();
  } catch (_) {}

  wrap.querySelector(".success-title")?.focus?.();
  wrap.querySelector(".dismiss")?.addEventListener("click", () => wrap.remove());
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
  )}</span><button class="toast-close" aria-label="Dismiss notification">&times;</button>`;

  container.appendChild(item);

  const showTimer = setTimeout(() => item.classList.add("show"), 20);
  const hideTimer = setTimeout(() => {
    item.classList.remove("show");
    setTimeout(() => item.remove(), 300);
  }, 4200);

  item.querySelector(".toast-close")?.addEventListener("click", (event) => {
    event.stopPropagation();
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    item.classList.remove("show");
    setTimeout(() => item.remove(), 150);
  });
}

function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"]/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char])
  );
}

function getRememberedSubscribers() {
  try {
    return JSON.parse(localStorage.getItem(SUBSCRIBED_EMAILS_KEY) || "[]");
  } catch (_) {
    return [];
  }
}

function setRememberedSubscribers(list) {
  try {
    localStorage.setItem(
      SUBSCRIBED_EMAILS_KEY,
      JSON.stringify(list.slice(-200))
    );
  } catch (_) {}
}

function rememberSubscriber(email) {
  const normalized = (email || "").trim().toLowerCase();
  if (!normalized) return;

  const remembered = getRememberedSubscribers();
  if (!remembered.includes(normalized)) {
    remembered.push(normalized);
    setRememberedSubscribers(remembered);
  }
}

function hasRememberedSubscriber(email) {
  const normalized = (email || "").trim().toLowerCase();
  return getRememberedSubscribers().includes(normalized);
}

function getQueuedSubscribers() {
  try {
    return JSON.parse(localStorage.getItem(SUBSCRIBER_QUEUE_KEY) || "[]");
  } catch (_) {
    return [];
  }
}

function setQueuedSubscribers(entries) {
  try {
    localStorage.setItem(
      SUBSCRIBER_QUEUE_KEY,
      JSON.stringify(entries.slice(-100))
    );
  } catch (_) {}
}

function queueSubscriber(email) {
  const normalized = (email || "").trim().toLowerCase();
  if (!normalized) return;

  const queue = getQueuedSubscribers().filter(
    (entry) => entry.email !== normalized
  );
  queue.push({
    email: normalized,
    source: window.location.pathname,
    queuedAt: Date.now(),
  });

  setQueuedSubscribers(queue);
}

async function flushQueuedSubscribers() {
  const queue = getQueuedSubscribers();
  if (!queue.length) return;

  try {
    const { submitSubscriber } = await getFirebaseModule();
    const remaining = [];

    for (const entry of queue) {
      try {
        await submitSubscriber(entry);
        rememberSubscriber(entry.email);
      } catch (_) {
        remaining.push(entry);
      }
    }

    setQueuedSubscribers(remaining);
  } catch (_) {}
}

async function submitNewsletter(email) {
  const normalized = (email || "").trim().toLowerCase();

  try {
    const { submitSubscriber } = await getFirebaseModule();
    await submitSubscriber({
      email: normalized,
      source: window.location.pathname,
    });
    return { ok: true };
  } catch (err) {
    console.warn("Newsletter signup queued locally.", err);
    queueSubscriber(normalized);
    return { ok: true, queued: true };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation();

  const toggleButton = document.querySelector(".menu-toggle");
  if (toggleButton) {
    toggleButton.setAttribute("aria-controls", "nav-links");
    toggleButton.setAttribute("aria-expanded", "false");
  }

  initializeFooter();
  flushQueuedSubscribers();
  window.addEventListener("online", flushQueuedSubscribers);

  document.addEventListener("click", (event) => {
    const list = document.getElementById("nav-links");
    const button = document.querySelector(".menu-toggle");
    if (!document.body.classList.contains("nav-open")) return;
    if (list && list.contains(event.target)) return;
    if (button && button.contains(event.target)) return;
    closeMenu();
  });

  const list = document.getElementById("nav-links");
  if (list) {
    list.addEventListener("click", (event) => {
      if (event.target?.tagName === "A") closeMenu();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 980) closeMenu();
  });
});
