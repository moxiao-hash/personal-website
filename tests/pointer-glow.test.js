import test from 'node:test';
import assert from 'node:assert/strict';
import { initializePointerGlow } from '../src/ui/pointer-glow.js';

test('pointer glow batches the latest coordinates into one animation frame', () => {
  let pointerHandler;
  const frames = [];
  const writes = [];
  const windowRef = {
    matchMedia: () => ({ matches: true }),
    addEventListener(type, handler) {
      assert.equal(type, 'pointermove');
      pointerHandler = handler;
    },
    requestAnimationFrame(callback) {
      frames.push(callback);
      return frames.length;
    },
  };
  const documentRef = {
    documentElement: {
      style: {
        setProperty(name, value) {
          writes.push([name, value]);
        },
      },
    },
  };

  initializePointerGlow({ windowRef, documentRef });
  pointerHandler({ clientX: 10, clientY: 20 });
  pointerHandler({ clientX: 30, clientY: 40 });

  assert.equal(frames.length, 1, 'only one frame is scheduled before paint');
  assert.deepEqual(writes, [], 'styles are not written during raw pointer events');

  frames[0]();
  assert.deepEqual(writes, [
    ['--pointer-x', '30px'],
    ['--pointer-y', '40px'],
  ]);
});

test('pointer glow does not listen on non-fine pointers', () => {
  let listened = false;

  initializePointerGlow({
    windowRef: {
      matchMedia: () => ({ matches: false }),
      addEventListener: () => { listened = true; },
      requestAnimationFrame: () => {},
    },
    documentRef: { documentElement: { style: {} } },
  });

  assert.equal(listened, false);
});
