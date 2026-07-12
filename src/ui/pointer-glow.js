export function initializePointerGlow({
  windowRef = globalThis.window,
  documentRef = globalThis.document,
} = {}) {
  if (!windowRef?.matchMedia('(pointer: fine)').matches || !documentRef) {
    return;
  }

  let frameId = null;
  let pointerX = 0;
  let pointerY = 0;

  windowRef.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;

    if (frameId !== null) {
      return;
    }

    frameId = windowRef.requestAnimationFrame(() => {
      documentRef.documentElement.style.setProperty('--pointer-x', `${pointerX}px`);
      documentRef.documentElement.style.setProperty('--pointer-y', `${pointerY}px`);
      frameId = null;
    });
  }, { passive: true });
}
