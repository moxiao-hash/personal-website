# Homepage browser QA — 2026-07-12

## Scope and environment

- Served from loopback only with `python3 -m http.server 4173 --bind 127.0.0.1`.
- Browser QA used Chrome through the approved CDP connection.
- Exact rendered viewport widths: 1440 px, 768 px, and 375 px.

## HTTP and asset checks

| Resource | Status | Bytes |
| --- | ---: | ---: |
| `/` (`index.html`) | 200 | 2,943 |
| `/assets/styles.css` | 200 | 4,886 |
| `/src/main.js` | 200 | 425 |

The repository contains no image, video, WebGL, canvas, WASM, or other heavy binary assets. The release uses HTML, CSS gradients, and small JavaScript modules only.

## Rendered browser results

All three viewports rendered the `moxiao6657` hero, followed by `about`, `learning`, `projects`, and `connect`, with the sky-blue layered gradient and deep-blue text. The rendered title was `moxiao6657 · 个人主页`; the meta description was present and described the student learning Vibe Coding, web development, and AI tools.

| Viewport | Learning grid | Project grid | Result |
| --- | ---: | ---: | --- |
| 1440 px | 3 columns | 2 columns | Desktop hierarchy and spacing rendered correctly. |
| 768 px | 3 columns | 2 columns | Tablet layout remained readable and balanced. |
| 375 px | 1 column | 1 column | Mobile content and both grids stacked without horizontal overflow. |

- GitHub rendered as the exact URL `https://github.com/moxiao-hash`, with `target="_blank"` and `rel="noopener noreferrer"`.
- Email rendered as the normal `mailto:166973742@qq.com` link, with no forced new-tab target.
- Exactly two project placeholders rendered. Both displayed `即将上线`, and each contained zero clickable links.
- On a fine-pointer browser, pointer movement updated the glow coordinates (`--pointer-x` and `--pointer-y`), visibly moving the soft sky-blue/white glow.
- Scroll reveal progressively marked intersecting sections visible; after scrolling through the page, the later sections revealed normally.
- The rendered stylesheet exposed a clear `:focus-visible` outline. Keyboard-focus behavior is also protected by the automated page contract test.
- Reduced-motion handling was verified through the rendered stylesheet and automated fallback tests: the media rule removes meaningful transition duration, while initialization does not add the hiding class when reduced motion is requested, so content remains visible.

## Automated verification and cleanup

- `npm test`: 24 tests passed, 0 failed.
- `git diff --check`: passed.
- Browser QA found no production defect, so no behavior change was required.
- The QA-created browser tab was closed and the loopback server was stopped after verification.
