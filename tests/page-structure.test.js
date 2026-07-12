import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const indexPath = new URL('../index.html', import.meta.url);

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
