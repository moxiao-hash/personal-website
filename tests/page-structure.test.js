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

test('homepage shows the approved identity, introduction, and goal statement', async () => {
  const html = await readHomepage();

  assert.match(html, />\s*moxiao6657\s*</i);
  assert.match(html, />\s*你好，我是姬天宇，你也可以叫我末晓。河南大学2024级网络工程在读。\s*</);
  assert.match(html, /<section\b[^>]*\bid=["']about["'][^>]*>[\s\S]*学生[\s\S]*Vibe Coding[\s\S]*<\/section>/i);

  // 学习区已改为"我要做的事"目标陈述
  assert.match(
    html,
    /<section\b[^>]*\bid=["']learning["'][^>]*>[\s\S]*我的目标[\s\S]*有实际意义的产品[\s\S]*<\/section>/i,
  );
  assert.match(html, /class=["'][^"']*\bgoal-statement\b[^"']*["']/i);
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

test('editorial upgrade adds nav, buttons, works block and browser mock', async () => {
  const html = await readHomepage();
  const css = await readFile(stylesheetPath, 'utf8');

  // 顶栏导航与状态点
  assert.match(html, /<nav\b[^>]*\bclass=["']nav["']/i);
  assert.match(html, /class=["'][^"']*\bstatus-dot\b[^"']*["']/);
  assert.match(html, />\s*Building in public\s*</i);

  // Hero 强调词与右侧场景
  assert.match(html, /class=["'][^"']*\bhero-scene\b[^"']*["']/i);
  assert.match(html, /<span\b[^>]*\bclass=["']accent["']>[^<]*<\/span>/i);

  // 按钮体系（实心主按钮 + 描边次级按钮）
  assert.match(html, /class=["'][^"']*\bbutton button--primary\b[^"']*["']/i);
  assert.match(html, /class=["'][^"']*\bbutton button--ghost\b[^"']*["']/i);

  // 作品区深蓝块与总数大编号
  assert.match(
    html,
    /<section\b[^>]*\bid=["']projects["'][^>]*\bclass=["'][^"']*\bworks\b[^"']*["']/i,
  );
  assert.match(html, /class=["'][^"']*\bworks-count\b[^"']*["']/);

  // CSS 侧：浏览器 mock 卡片头、深蓝块 token、状态点脉冲
  assert.match(css, /\.project-grid\s+article::before\b/i);
  assert.match(css, /--works-bg\s*:/i);
  assert.match(css, /\.status-dot::before\b/i);
});

test('interaction upgrade wires cursor ring, magnetic buttons and scene spin', async () => {
  const html = await readHomepage();
  const css = await readFile(stylesheetPath, 'utf8');
  const main = await readFile(mainPath, 'utf8');
  const cursorPath = new URL('../src/ui/cursor.js', import.meta.url);
  const magneticPath = new URL('../src/ui/magnetic.js', import.meta.url);
  const cursor = await readFile(cursorPath, 'utf8');
  const magnetic = await readFile(magneticPath, 'utf8');

  // main.js 初始化两个新模块
  assert.match(main, /initializeCursor\(document\)/);
  assert.match(main, /initializeMagnetic\(document\)/);

  // 模块各自的精指针 / 动画守卫
  assert.match(cursor, /matchMedia\(["']\(pointer:\s*fine\)["']\)/);
  assert.match(cursor, /prefers-reduced-motion/);
  assert.match(magnetic, /matchMedia\(["']\(pointer:\s*fine\)["']\)/);
  assert.match(magnetic, /prefers-reduced-motion/);

  // CSS：跟随环、场景自转、磁吸按钮
  assert.match(css, /\.cursor-ring\b/);
  assert.match(css, /@keyframes\s+scene-spin\b/);
  assert.match(css, /animation:\s*s[c]?/);
  assert.match(html, /class=["'][^"']*\bhero-scene\b[^"']*["']/i);
});
