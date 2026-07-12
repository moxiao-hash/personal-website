# moxiao6657 Personal Homepage Implementation Plan

> **For agentic workers:** REQUIRED: Use $subagent-driven-development (if subagents available) or $executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a responsive sky-blue interactive static personal homepage for moxiao6657, with future project links.

**Architecture:** Dependency-free static HTML, CSS, and ES modules. Semantic HTML provides the page structure; CSS owns the responsive visual system and motion fallbacks; modules own editable personal/project data, safe card rendering, and pointer-glow setup. Output remains portable to static hosting, Nginx, or Caddy.

**Tech Stack:** HTML5, CSS3, vanilla ES modules, Node.js built-in test runner.

---

## File Structure

- `index.html` — semantic single-page layout, SEO metadata, and module entry point.
- `assets/styles.css` — responsive sky-blue visuals, glow, animation, focus and reduced-motion styles.
- `src/data/site-data.js` — editable profile and future-project records.
- `src/ui/projects.js` — project state, URL validation, and safe project-card markup.
- `src/ui/reveal.js` — progressively enhanced scroll-reveal initializer with safe no-JS and reduced-motion fallbacks.
- `src/main.js` — project rendering and fine-pointer glow initialization.
- `tests/site-data.test.js` — unit tests for confirmed data and project-card states.
- `tests/page-structure.test.js` — static tests for required page structure and accessibility hooks.
- `tests/reveal.test.js` — unit tests for progressive scroll-reveal setup and its fallbacks.
- `package.json` — Node test command only; no runtime dependencies.
- `README.md` — local preview, testing, updates, static-hosting and self-server deployment.

## Chunk 1: Content data and semantic foundation

### Task 1: Create a test harness and verified site data

**Files:**
- Create: `package.json`
- Create: `tests/site-data.test.js`
- Create: `src/data/site-data.js`
- Create: `src/ui/projects.js`

- [ ] **Step 1: Add `package.json` with `{ "type": "module", "scripts": { "test": "node --test" } }`.**
- [ ] **Step 2: Write failing tests that import `profile`, `projects`, and `getProjectState`. Assert `profile.handle === 'moxiao6657'`, GitHub URL is `https://github.com/moxiao-hash`, and email is `166973742@qq.com`. Assert exactly two placeholder records, each with non-empty `name`, `description`, and `tags`, plus `url: ''`. Assert a valid HTTPS fixture is `live`; empty, whitespace-only, malformed, `javascript:`, and `data:` URLs are `coming-soon`.**
- [ ] **Step 3: Run `npm test`; expect failure because data/UI modules do not exist.**
- [ ] **Step 4: Implement profile data plus two placeholder records with the schema `{ name, description, tags, url: '' }`. Implement `getProjectState(project)` to return `live` only for a valid non-empty HTTP(S) URL and `coming-soon` otherwise.**
- [ ] **Step 5: Run `npm test`; expect all content tests to pass.**
- [ ] **Step 6: Commit.**

```bash
git add package.json src/data/site-data.js src/ui/projects.js tests/site-data.test.js
git commit -m "feat: add editable personal site content data"
```

### Task 2: Create a tested semantic page shell

**Files:**
- Create: `index.html`
- Create: `tests/page-structure.test.js`

- [ ] **Step 1: Write failing file-content tests for Chinese document language, title/description, one `<h1>`, `<main>`, section IDs `about`, `learning`, `projects`, `connect`, visible `moxiao6657` and `学生 · 正在学习 Vibe Coding 的人` hero text, an About sentence mentioning students and Vibe Coding, the three learning topics `Vibe Coding`/`网页开发`/`AI 工具`, a dedicated `id="project-list"` inside the Projects section, the confirmed `mailto:` address, GitHub URL, and module script `./src/main.js`.**
- [ ] **Step 2: Run `npm test`; expect `index.html` missing failure.**
- [ ] **Step 3: Implement hero, about, three learning cards, an `id="project-list"` element inside the Projects section, contact links, and footer in approved Chinese content. GitHub uses `target="_blank" rel="noopener noreferrer"`; email retains normal `mailto:` behavior.**
- [ ] **Step 4: Run `npm test`; expect all tests to pass.**
- [ ] **Step 5: Commit.**

```bash
git add index.html tests/page-structure.test.js
git commit -m "feat: add semantic personal homepage shell"
```

## Chunk 2: Project rendering and visual interaction

### Task 3: Test and implement project cards

**Files:**
- Modify: `src/ui/projects.js`
- Modify: `tests/site-data.test.js`
- Create: `src/main.js`

- [ ] **Step 1: Add failing tests for `createProjectCardMarkup(project)`: URL-less input includes `即将上线` and no href; a live fixture includes its validated URL, new-tab target, `noopener noreferrer`, and a discernible accessible link name `访问 {project name}`. Add hostile fixtures whose name/tag include `<script>` and `</a>` and whose URL contains quote-sensitive characters; assert emitted markup encodes text/attributes, contains no executable element, and only uses the validated normalized URL.**
- [ ] **Step 2: Run `npm test`; expect missing-export failure.**
- [ ] **Step 3: Implement URL protocol validation/normalization, context-appropriate HTML escaping for text and attributes, accessible live-card links, and non-clickable coming-soon cards. In `src/main.js`, render the central `projects` list into `#project-list`; never interpolate unvalidated URL data into an attribute.**
- [ ] **Step 4: Run `npm test`; expect all project-state and markup tests to pass.**
- [ ] **Step 5: Commit.**

```bash
git add src/main.js src/ui/projects.js tests/site-data.test.js
git commit -m "feat: render extensible project cards"
```

### Task 4: Test and build the sky-blue visual system

**Files:**
- Create: `assets/styles.css`
- Modify: `index.html`
- Modify: `src/main.js`
- Create: `src/ui/reveal.js`
- Modify: `tests/page-structure.test.js`
- Create: `tests/reveal.test.js`

- [ ] **Step 1: Add failing tests confirming stylesheet loading, `prefers-reduced-motion: reduce`, visible `:focus-visible`, touch/pointer media query, and fine-pointer guarded pointer-glow updates. Add unit tests for `initializeReveal`: with supported observer and no reduced motion it adds a `reveal-enabled` class before observing elements; with missing observer or reduced motion it adds no hiding class. Add a CSS test/QA assertion that narrow widths use one-column grids and only wider widths introduce multi-column layouts.**
- [ ] **Step 2: Run `npm test`; expect visual/accessibility hook failures.**
- [ ] **Step 3: Implement bright sky-blue gradient layers, a CSS-variable pointer glow, deep-blue readable text, hover lift, focus rings, and static/mobile/reduced-motion fallbacks. Keep all content visible by default; only scope hidden pre-reveal styles beneath a JS-added `.reveal-enabled` class. Implement `initializeReveal` in `src/ui/reveal.js`: after it confirms observer support and no reduced motion, add that class, observe `.reveal` elements, and add `is-visible` on entry; never add it when unsupported or reduced motion is requested. Make learning/project grids single-column on narrow touch/mobile widths and multi-column only at a defined wider breakpoint. Attach pointer listeners only under `(pointer: fine)`.**
- [ ] **Step 4: Run `npm test`; expect all tests green.**
- [ ] **Step 5: Commit.**

```bash
git add assets/styles.css src/main.js src/ui/reveal.js index.html tests/page-structure.test.js tests/reveal.test.js
git commit -m "feat: add sky-blue interactive visual system"
```

## Chunk 3: Documentation, QA, and GitHub delivery

### Task 5: Document updates and deployment

**Files:**
- Create: `README.md`
- Modify: `tests/page-structure.test.js`

- [ ] **Step 1: Add a failing README test requiring `npm test`, project updates in `src/data/site-data.js`, static hosting, and Nginx/Caddy deployment.**
- [ ] **Step 2: Run `npm test`; expect README-missing failure.**
- [ ] **Step 3: Write concise README instructions for local static preview and `npm test`; explain the complete project record schema `{ name, description, tags, url }`, that only valid HTTP(S) URLs produce a live link, and how URL-less records remain safely marked `即将上线`. Document free hosting and self-hosting: there is no build step, so upload `index.html`, `assets/`, and `src/` to the web-server document root; set the hostname, enable HTTPS (Caddy automatic TLS or Nginx certificate plus HTTP-to-HTTPS redirect), and point project subdomains to their own deployments.**
- [ ] **Step 4: Run `npm test`; expect all tests green.**
- [ ] **Step 5: Commit.**

```bash
git add README.md tests/page-structure.test.js
git commit -m "docs: explain personal website deployment and updates"
```

### Task 6: Run visual QA and push the feature branch

**Files:**
- Verify: `index.html`, `assets/styles.css`, `src/main.js`
- Modify when needed: the smallest affected file, preceded by a failing regression test for a behavior defect.

- [ ] **Step 1: Start `python3 -m http.server 4173 --bind 127.0.0.1` from the worktree and verify HTTP 200 responses for `/`, `/assets/styles.css`, and `/src/main.js`.**
- [ ] **Step 2: Inspect at explicit desktop (1440px), tablet (768px), and mobile (375px) widths. Verify hierarchy, pointer glow, one-column mobile grids, project states, focus, intersection-observer reveals, and reduced-motion behavior (all content stays visible without animation). Verify the actual GitHub new-tab URL/rel behavior, normal `mailto:` target, and both URL-less cards have no clickable link. Verify title and meta description in the rendered document.**
- [ ] **Step 3: Check the repository has no video, image, WebGL, or other heavy binary assets, and record the byte size of `index.html`, CSS, and JavaScript files to confirm the lightweight first-release intent.**
- [ ] **Step 4: If defects are found, add a focused failing test before correcting code; then rerun `npm test`.**
- [ ] **Step 5: Run a fresh final `npm test`; expect all tests to pass.**
- [ ] **Step 6: Commit any QA fixes.**
- [ ] **Step 7: Verify and push to `git@github.com:moxiao-hash/personal-website.git`.**

```bash
git status --short
git branch --show-current
if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin git@github.com:moxiao-hash/personal-website.git
fi
test "$(git remote get-url origin)" = git@github.com:moxiao-hash/personal-website.git
git fetch origin
git push -u origin feat/personal-website
```

Expected: working tree is clean and current branch is `feat/personal-website`. If `origin` is absent it is added with the user-authorized URL; otherwise its URL must exactly equal `git@github.com:moxiao-hash/personal-website.git`. Stop and report if the existing remote differs, if fetch reveals an unrelated/non-fast-forward history, or if push is rejected; do not overwrite remotes or force-push. Otherwise the feature branch is published in the user-provided repository. Do not merge or alter repository settings without separate authorization.
