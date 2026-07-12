import test from 'node:test';
import assert from 'node:assert/strict';
import { initializeReveal } from '../src/ui/reveal.js';

function createFixture() {
  const events = [];
  const classes = new Set();
  const elements = [{ classList: { add: (name) => events.push(`element:${name}`) } }];
  const documentRef = {
    documentElement: {
      classList: {
        add(name) {
          classes.add(name);
          events.push(`root:${name}`);
        },
      },
    },
    querySelectorAll(selector) {
      assert.equal(selector, '.reveal');
      return elements;
    },
  };

  return { classes, documentRef, elements, events };
}

test('initializeReveal enables hiding before observing when supported and motion is allowed', () => {
  const fixture = createFixture();
  const observed = [];
  class Observer {
    constructor(callback) {
      this.callback = callback;
    }

    observe(element) {
      observed.push(element);
      fixture.events.push('observe');
    }
  }

  initializeReveal({
    documentRef: fixture.documentRef,
    IntersectionObserverCtor: Observer,
    matchMedia: () => ({ matches: false }),
  });

  assert.ok(fixture.classes.has('reveal-enabled'));
  assert.deepEqual(observed, fixture.elements);
  assert.ok(fixture.events.indexOf('root:reveal-enabled') < fixture.events.indexOf('observe'));
});

test('initializeReveal reveals an element when it enters the viewport', () => {
  const fixture = createFixture();
  let callback;
  class Observer {
    constructor(observerCallback) {
      callback = observerCallback;
    }

    observe() {}
    unobserve(element) {
      fixture.events.push(element === fixture.elements[0] ? 'unobserve' : 'wrong-element');
    }
  }

  initializeReveal({
    documentRef: fixture.documentRef,
    IntersectionObserverCtor: Observer,
    matchMedia: () => ({ matches: false }),
  });
  callback([{ isIntersecting: true, target: fixture.elements[0] }], { unobserve: (element) => fixture.events.push(element === fixture.elements[0] ? 'unobserve' : 'wrong-element') });

  assert.ok(fixture.events.includes('element:is-visible'));
  assert.ok(fixture.events.includes('unobserve'));
});

test('initializeReveal does not add a hiding class without observer support', () => {
  const fixture = createFixture();

  initializeReveal({
    documentRef: fixture.documentRef,
    IntersectionObserverCtor: undefined,
    matchMedia: () => ({ matches: false }),
  });

  assert.equal(fixture.classes.has('reveal-enabled'), false);
});

test('initializeReveal does not add a hiding class when reduced motion is requested', () => {
  const fixture = createFixture();

  initializeReveal({
    documentRef: fixture.documentRef,
    IntersectionObserverCtor: class {},
    matchMedia: () => ({ matches: true }),
  });

  assert.equal(fixture.classes.has('reveal-enabled'), false);
});
