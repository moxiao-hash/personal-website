import test from 'node:test';
import assert from 'node:assert/strict';

import { applyProfile } from '../src/ui/profile.js';

function createFakeElement() {
  const attributes = new Map();

  return {
    textContent: '',
    setAttribute(name, value) {
      attributes.set(name, value);
    },
    removeAttribute(name) {
      attributes.delete(name);
    },
    getAttribute(name) {
      return attributes.get(name) ?? null;
    },
    set innerHTML(_value) {
      throw new Error('applyProfile must not use innerHTML');
    },
  };
}

function createFakeRoot() {
  const elements = new Map([
    ['[data-profile-handle]', createFakeElement()],
    ['[data-profile-identity]', createFakeElement()],
    ['[data-profile-email]', createFakeElement()],
    ['[data-profile-github]', createFakeElement()],
    ['[data-profile-footer-handle]', createFakeElement()],
  ]);

  return {
    elements,
    querySelector(selector) {
      return elements.get(selector) ?? null;
    },
  };
}

test('applyProfile safely updates visible identity and contact links from data', () => {
  const root = createFakeRoot();

  applyProfile(root, {
    handle: '<moxiao-test>',
    identity: '学生 · Vibe Coding 学习者',
    email: 'student+site@example.com',
    emailLabel: '给我发邮件',
    github: ' HTTPS://GitHub.COM/example-user ',
    githubLabel: '我的 GitHub',
  });

  assert.equal(root.elements.get('[data-profile-handle]').textContent, '<moxiao-test>');
  assert.equal(root.elements.get('[data-profile-identity]').textContent, '学生 · Vibe Coding 学习者');
  assert.equal(root.elements.get('[data-profile-footer-handle]').textContent, '<moxiao-test>');

  const email = root.elements.get('[data-profile-email]');
  assert.equal(email.textContent, '给我发邮件');
  assert.equal(email.getAttribute('href'), 'mailto:student%2Bsite@example.com');
  assert.equal(email.getAttribute('target'), null);

  const github = root.elements.get('[data-profile-github]');
  assert.equal(github.textContent, '我的 GitHub');
  assert.equal(github.getAttribute('href'), 'https://github.com/example-user');
  assert.equal(github.getAttribute('target'), '_blank');
  assert.equal(github.getAttribute('rel'), 'noopener noreferrer');
});

test('applyProfile never exposes an unsafe GitHub URL', () => {
  const root = createFakeRoot();

  applyProfile(root, {
    handle: 'safe',
    identity: 'student',
    email: 'safe@example.com',
    emailLabel: 'Email',
    github: 'javascript:alert(1)',
    githubLabel: 'GitHub',
  });

  assert.equal(root.elements.get('[data-profile-github]').getAttribute('href'), null);
});
