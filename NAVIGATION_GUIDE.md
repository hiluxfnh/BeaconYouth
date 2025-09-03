# Unified Navigation System - Documentation

## Overview

The website now uses a JavaScript-based unified navigation system. This means you only need to update the navigation in **ONE PLACE** (`script.js`) and it will automatically update across all pages.

## How It Works

### 1. Navigation Configuration (script.js)

The navigation items are defined in the `navigationConfig` array in `script.js`:

```javascript
const navigationConfig = [
  { href: "about.html", text: "About" },
  { href: "team.html", text: "Team" },
  { href: "get-involved.html", text: "Get Involved" },
  { href: "news.html", text: "News" },
  { href: "contact.html", text: "Contact" },
];
```

### 2. How to Update Navigation

**To ADD a new navigation item:**

1. Open `script.js`
2. Add a new object to the `navigationConfig` array:
   ```javascript
   { href: 'new-page.html', text: 'New Page' }
   ```

**To REMOVE a navigation item:**

1. Open `script.js`
2. Delete the corresponding object from the `navigationConfig` array

**To CHANGE a navigation item:**

1. Open `script.js`
2. Modify the `href` or `text` property in the `navigationConfig` array

### 3. HTML Structure for Pages

Each HTML page should have this navigation structure:

```html
<nav>
  <button class="menu-toggle" onclick="toggleMenu()">☰</button>
  <ul class="nav-links" id="nav-links">
    <!-- Navigation will be populated by script.js -->
  </ul>
</nav>
```

**Important:**

- Make sure each page includes `<script src="script.js"></script>` before the closing `</body>` tag
- The `id="nav-links"` is required for the JavaScript to work

### 4. Creating New Pages

Use the `_template.html` file as a starting point for new pages:

1. Copy `_template.html`
2. Rename it to your new page name (e.g., `new-page.html`)
3. Replace the placeholders:
   - `PAGE_TITLE` - The page title for the browser tab
   - `PAGE_KICKER` - Small uppercase label above the heading
   - `PAGE_HEADING` - Main page heading
   - `PAGE_DESCRIPTION` - Description text below the heading
   - `PAGE_CONTENT_HERE` - Your main page content
4. Add the new page to the navigation in `script.js` if needed

### 5. Benefits of This System

✅ **Single source of truth** - Update navigation in one place only
✅ **Consistent navigation** - All pages automatically have the same navigation
✅ **Easier maintenance** - No need to update every HTML file when navigation changes
✅ **Current page highlighting** - Automatically highlights the current page in navigation
✅ **Responsive** - Works with the existing mobile menu toggle

### 6. Files Updated

The following files now use the unified navigation system:

- `index.html` ✓
- `about.html` ✓
- `script.js` ✓ (contains the navigation configuration)

**Empty files that need content:**

- `team.html`, `contact.html`, `news.html`, `get-involved.html`
- `education.html`, `climate.html`, `tech.html`, `gbv.html`, `donate.html`

Use the `_template.html` file to create content for these pages.

## Troubleshooting

**Navigation not showing:**

- Check that the page includes `<script src="script.js"></script>`
- Check that the navigation container has `id="nav-links"`

**Current page not highlighted:**

- The system automatically detects the current page by filename
- Make sure the filename in `navigationConfig` matches exactly

**Mobile menu not working:**

- Check that the menu button has `onclick="toggleMenu()"`
- Check that the navigation has the correct CSS classes
