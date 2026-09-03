import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { profile, projects } from '../src/data/site-data.js';
import {
  createProjectCardMarkup,
  getProjectState,
} from '../src/ui/projects.js';

test('profile exposes the personal site identity and contact links', () => {
  assert.equal(profile.handle, 'moxiao6657');
  assert.equal(profile.identity, '学生 · 正在学习 Vibe Coding 的人');
  assert.equal(profile.github, 'https://github.com/moxiao-hash');
  assert.equal(profile.githubLabel, 'GitHub');
  assert.equal(profile.email, '166973742@qq.com');
  assert.equal(profile.emailLabel, '发送邮件');
});

test('projects lists the account repositories with complete metadata', () => {
  assert.ok(projects.length >= 4);

  for (const project of projects) {
    assert.equal(typeof project.name, 'string');
    assert.ok(project.name.length > 0);
    assert.equal(typeof project.description, 'string');
    assert.ok(project.description.length > 0);
    assert.ok(Array.isArray(project.tags));
    assert.ok(project.tags.length > 0);
    assert.ok(project.tags.every((tag) => typeof tag === 'string' && tag.length > 0));
    assert.equal(typeof project.url, 'string');
  }
});

test('public repositories expose live links while the private one stays coming-soon', () => {
  const publicRepos = ['project', 'clawd-on-desk', 'FItKeep', 'mineclearance'];
  for (const repo of publicRepos) {
    const project = projects.find(
      (p) => p.url === `https://github.com/moxiao-hash/${repo}`,
    );
    assert.ok(project, `${repo} should be listed`);
    assert.equal(getProjectState(project.url), 'live');
  }

  const privateProject = projects.find((p) => p.name === 'Soper Topography');
  assert.ok(privateProject);
  assert.equal(getProjectState(privateProject.url), 'coming-soon');
});

test('a valid HTTPS project URL is live', () => {
  assert.equal(getProjectState('https://example.com/project'), 'live');
});

test('unavailable or unsafe project URLs are coming soon', () => {
  const unavailableUrls = [
    '',
    '   ',
    'not a url',
    'javascript:alert(1)',
    'data:text/html,hello',
  ];

  for (const url of unavailableUrls) {
    assert.equal(getProjectState(url), 'coming-soon');
  }
});

test('a URL-less project renders a non-clickable coming-soon card', () => {
  const markup = createProjectCardMarkup({
    name: '未来作品',
    description: '仍在构思中。',
    tags: ['实验'],
    url: '',
  });

  assert.match(markup, /即将上线/);
  assert.doesNotMatch(markup, /\bhref\s*=/i);
});

test('a live project renders a normalized safe and accessible link', () => {
  const markup = createProjectCardMarkup({
    name: '天空实验室',
    description: '一个网页实验。',
    tags: ['Web'],
    url: ' HTTPS://Example.COM:443/demo ',
  });

  assert.match(markup, /href="https:\/\/example\.com\/demo"/);
  assert.match(markup, /target="_blank"/);
  assert.match(markup, /rel="noopener noreferrer"/);
  assert.match(markup, /aria-label="访问 天空实验室"/);
});

test('project markup escapes hostile text and uses only a validated normalized URL', () => {
  const markup = createProjectCardMarkup({
    name: '<script>alert(1)</script>',
    description: 'closing </a> and <b>markup</b>',
    tags: ['tag </a>', '<script>bad()</script>'],
    url: 'https://example.com/search?q="quoted"&next=<script>',
  });

  assert.doesNotMatch(markup, /<script\b/i);
  assert.doesNotMatch(markup, /<b>markup<\/b>/i);
  assert.doesNotMatch(markup, /tag <\/a>/i);
  assert.match(markup, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(markup, /tag &lt;\/a&gt;/);
  assert.match(
    markup,
    /href="https:\/\/example\.com\/search\?q=%22quoted%22&amp;next=%3Cscript%3E"/,
  );
  assert.equal((markup.match(/\bhref=/g) ?? []).length, 1);
});

test('an unsafe hostile URL never becomes an attribute', () => {
  const markup = createProjectCardMarkup({
    name: '危险链接',
    description: '不应可点击。',
    tags: ['安全'],
    url: 'javascript:alert("owned")',
  });

  assert.match(markup, /即将上线/);
  assert.doesNotMatch(markup, /\bhref\s*=/i);
  assert.doesNotMatch(markup, /javascript:/i);
});

test('index.html statically contains the rendered project cards', async () => {
  const indexPath = new URL('../index.html', import.meta.url);
  const html = await readFile(indexPath, 'utf8');

  // 每个项目都应作为静态卡片出现在 HTML 中，查看源代码即可见。
  for (const project of projects) {
    assert.ok(html.includes(project.name), `expected static card for ${project.name}`);
    assert.ok(html.includes(project.description), `expected static text for ${project.name}`);
  }

  // 公开仓库有可点击链接，私有仓库显示"即将上线"。
  const publicCount = (html.match(/访问作品/g) ?? []).length;
  const comingSoonCount = (html.match(/即将上线/g) ?? []).length;
  const publicRepos = projects.filter((p) => getProjectState(p.url) === 'live').length;

  assert.equal(publicCount, publicRepos);
  assert.equal(comingSoonCount, projects.length - publicRepos);
});
