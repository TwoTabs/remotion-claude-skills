# Playwright Test Sites

Public websites for testing Playwright automation and the `/playwright-tutorial-video` skill.

## Sites

### 1. Playwright Docs
- **URL:** https://playwright.dev
- **Good for:** navigation, search, docs browsing, anchor links

### 2. The Internet (Heroku)
- **URL:** https://the-internet.herokuapp.com
- **Good for:** login, dropdowns, uploads, iframes, dynamic content, drag-and-drop

### 3. Playwright TodoMVC Demo
- **URL:** https://demo.playwright.dev/todomvc
- **Good for:** stable, predictable CRUD flows

### 4. Sauce Demo
- **URL:** https://www.saucedemo.com
- **Good for:** end-to-end e-commerce — login, browse, cart, checkout
- **Login:** `standard_user` / `secret_sauce`

## Interactive Recorder

Record a manual browser flow with accurate element coordinates for Remotion highlight boxes:

```bash
npx tsx scripts/interactive-record.ts <flow-slug> <start-url>
```

**Phase 1** — Browser opens, log in if needed, navigate to your start page, press Enter.  
**Phase 2** — Recording starts. Every click is captured with its exact bounding box. Press Enter when done.

Produces `public/recordings/<slug>/recording.webm` and `manifest.json` with pixel-perfect coordinates. Feed the manifest into the `/playwright-tutorial-video` skill with `Entry: from-manifest`.
