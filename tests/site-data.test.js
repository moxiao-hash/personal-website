import test from 'node:test';
import assert from 'node:assert/strict';

import { profile, projects } from '../src/data/site-data.js';
import { getProjectState } from '../src/ui/projects.js';

test('profile exposes the personal site identity and contact links', () => {
  assert.equal(profile.handle, 'moxiao6657');
  assert.equal(profile.github, 'https://github.com/moxiao-hash');
  assert.equal(profile.email, '166973742@qq.com');
});

test('projects starts with exactly two complete placeholders', () => {
  assert.equal(projects.length, 2);

  for (const project of projects) {
    assert.equal(typeof project.name, 'string');
    assert.ok(project.name.length > 0);
    assert.equal(typeof project.description, 'string');
    assert.ok(project.description.length > 0);
    assert.ok(Array.isArray(project.tags));
    assert.ok(project.tags.length > 0);
    assert.ok(project.tags.every((tag) => typeof tag === 'string' && tag.length > 0));
    assert.equal(project.url, '');
  }
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
