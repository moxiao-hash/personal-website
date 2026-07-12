import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const indexPath = new URL('../index.html', import.meta.url);
const stylesheetPath = new URL('../assets/styles.css', import.meta.url);
const mainPath = new URL('../src/main.js', import.meta.url);
const pointerGlowPath = new URL('../src/ui/pointer-glow.js', import.meta.url);
const readmePath = new URL('../README.md', import.meta.url);

async function readHomepage() {
  return readFile(indexPath, 'utf8');
}

test('homepage provides Chinese document metadata', async () => {
  const html = await readHomepage();

  assert.match(html, /<html\b[^>]*\blang=["']zh-CN["']/i);
  assert.match(html, /<title>[^<]*moxiao6657[^<]*<\/title>/i);
  assert.match(
    html,
    /<meta\b(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["'][^"']+["'])[^>]*>/i,
  );
});

test('homepage has one primary heading and semantic main content', async () => {
  const html = await readHomepage();
  const headings = html.match(/<h1\b/gi) ?? [];

  assert.equal(headings.length, 1);
  assert.match(html, /<main\b[^>]*>/i);
});

test('homepage includes every approved content section', async () => {
  const html = await readHomepage();

  for (const id of ['about', 'learning', 'projects', 'connect']) {
    assert.match(html, new RegExp(`<section\\b[^>]*\\bid=["']${id}["']`, 'i'));
  }

  const projectsSection = html.match(
    /<section\b[^>]*\bid=["']projects["'][^>]*>[\s\S]*?<\/section>/i,
  )?.[0];
  assert.ok(projectsSection, 'expected a Projects section');
  assert.match(projectsSection, /\bid=["']project-list["']/i);
});

test('homepage shows the approved identity, introduction, and learning topics', async () => {
  const html = await readHomepage();

  assert.match(html, />\s*moxiao6657\s*</i);
  assert.match(html, />\s*学生 · 正在学习 Vibe Coding 的人\s*</);
  assert.match(html, /<section\b[^>]*\bid=["']about["'][^>]*>[\s\S]*学生[\s\S]*Vibe Coding[\s\S]*<\/section>/i);

  for (const topic of ['Vibe Coding', '网页开发', 'AI 工具']) {
    assert.ok(html.includes(topic), `expected learning topic: ${topic}`);
  }
});

test('homepage exposes confirmed contact links and the module entry point', async () => {
  const html = await readHomepage();

  assert.match(html, /href=["']mailto:166973742@qq\.com["']/i);
  assert.match(html, /href=["']https:\/\/github\.com\/moxiao-hash["']/i);
  assert.match(
    html,
    /<script\b(?=[^>]*\btype=["']module["'])(?=[^>]*\bsrc=["']\.\/src\/main\.js["'])[^>]*><\/script>/i,
  );
});

test('homepage loads the visual stylesheet and marks content for progressive reveal', async () => {
  const html = await readHomepage();

  assert.match(html, /<link\b(?=[^>]*\brel=["']stylesheet["'])(?=[^>]*\bhref=["']\.\/assets\/styles\.css["'])[^>]*>/i);
  assert.match(html, /<section\b[^>]*\bclass=["'][^"']*\breveal\b[^"']*["']/i);
});

test('visual system includes accessible motion, focus, and pointer fallbacks', async () => {
  const css = await readFile(stylesheetPath, 'utf8');

  assert.match(css, /--accent\s*:\s*#0563b8\s*;/i, 'small accent text uses the reviewed AA contrast token');
  assert.match(css, /@media\s*\([^)]*prefers-reduced-motion\s*:\s*reduce[^)]*\)/i);
  assert.match(css, /:focus-visible\s*\{[^}]*outline\s*:/is);
  assert.match(css, /@media\s*\([^)]*(?:pointer|hover)\s*:\s*(?:coarse|none)[^)]*\)/i);
  assert.match(css, /\.reveal-enabled\s+\.reveal(?![\w-])[^,{]*\{/i);
});

test('content grids stay single-column until an explicit wider breakpoint', async () => {
  const css = await readFile(stylesheetPath, 'utf8');
  const firstMedia = css.search(/@media\s*\([^)]*min-width\s*:/i);
  const baseCss = firstMedia === -1 ? css : css.slice(0, firstMedia);
  const wideCss = firstMedia === -1 ? '' : css.slice(firstMedia);

  assert.match(baseCss, /\.learning-grid[^{]*\{[^}]*grid-template-columns\s*:\s*1fr/is);
  assert.match(baseCss, /\.project-grid[^{]*\{[^}]*grid-template-columns\s*:\s*1fr/is);
  assert.match(wideCss, /@media\s*\([^)]*min-width\s*:\s*\d+(?:px|rem)[^)]*\)[\s\S]*\.learning-grid[^{]*\{[^}]*grid-template-columns\s*:\s*repeat\(/i);
  assert.match(wideCss, /@media\s*\([^)]*min-width\s*:\s*\d+(?:px|rem)[^)]*\)[\s\S]*\.project-grid[^{]*\{[^}]*grid-template-columns\s*:\s*repeat\(/i);
});

test('pointer glow updates are guarded by a fine-pointer media query', async () => {
  const main = await readFile(mainPath, 'utf8');
  const pointerGlow = await readFile(pointerGlowPath, 'utf8');

  assert.match(main, /initializePointerGlow\(\)/);
  assert.match(pointerGlow, /matchMedia\(["']\(pointer:\s*fine\)["']\)/);
  assert.match(pointerGlow, /addEventListener\(["']pointermove["']/);
  assert.match(pointerGlow, /--pointer-x/);
  assert.match(pointerGlow, /--pointer-y/);
});

test('README explains content updates and portable deployment', async () => {
  const readme = await readFile(readmePath, 'utf8');

  assert.match(readme, /npm test/);
  assert.match(readme, /src\/data\/site-data\.js/);
  for (const field of ['name', 'description', 'tags', 'url']) {
    assert.match(readme, new RegExp(`\\b${field}\\b`));
  }
  assert.match(readme, /HTTP\(S\)|HTTPS?/i);
  assert.match(readme, /即将上线/);
  assert.match(readme, /静态托管/);
  assert.match(readme, /无需构建|没有构建步骤/);
  for (const path of ['index.html', 'assets/', 'src/']) {
    assert.ok(readme.includes(path), `expected deployment path: ${path}`);
  }
  assert.match(readme, /Nginx/);
  assert.match(readme, /Caddy/);
  assert.match(readme, /主机名|域名/);
  assert.match(readme, /HTTPS/);
  assert.match(readme, /子域名/);
});
